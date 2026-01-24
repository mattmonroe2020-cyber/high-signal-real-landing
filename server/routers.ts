import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  createLead, 
  getLeadByEmail, 
  getAllLeads, 
  updateLeadBookingStatus,
  createEmailSequence,
  getPendingEmails,
  updateEmailStatus,
  trackAnalyticsEvent,
  trackPageView,
  getAnalyticsSummary,
  getLeadsWithEmailStatus
} from "./db";
import { TRPCError } from "@trpc/server";
import { processEmailQueue, sendImmediateEmail } from "./emailService";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Leads router for email capture
  leads: router({
    submit: publicProcedure
      .input(z.object({
        firstName: z.string().min(1),
        email: z.string().email(),
        company: z.string().optional(),
        stage: z.enum(["pre-seed", "seed", "series-a", "other"]).optional(),
        isNeurodivergent: z.boolean().optional(),
        source: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Check if email already exists
        const existingLead = await getLeadByEmail(input.email);
        if (existingLead) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You've already downloaded the playbook. Check your email!",
          });
        }

        // Create the lead
        const lead = await createLead({
          firstName: input.firstName,
          email: input.email,
          company: input.company || null,
          stage: input.stage || null,
          isNeurodivergent: input.isNeurodivergent || false,
          source: input.source || null,
          utmMedium: input.utmMedium || null,
          utmCampaign: input.utmCampaign || null,
        });

        // Schedule email sequence
        const now = new Date();
        
        // Playbook email - immediate
        await createEmailSequence({
          leadId: lead.id,
          sequenceNumber: 0,
          emailType: "playbook",
          scheduledFor: now,
        });

        // Follow-up 1 - 2 days later
        const followUp1 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
        await createEmailSequence({
          leadId: lead.id,
          sequenceNumber: 1,
          emailType: "followup-1",
          scheduledFor: followUp1,
        });

        // Follow-up 2 - 5 days later
        const followUp2 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
        await createEmailSequence({
          leadId: lead.id,
          sequenceNumber: 2,
          emailType: "followup-2",
          scheduledFor: followUp2,
        });

        // Follow-up 3 - 10 days later
        const followUp3 = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
        await createEmailSequence({
          leadId: lead.id,
          sequenceNumber: 3,
          emailType: "followup-3",
          scheduledFor: followUp3,
        });

        // Track analytics event
        await trackAnalyticsEvent({
          eventType: "form_submit",
          eventData: { formType: "playbook_download" },
          leadId: lead.id,
          source: input.source || null,
          utmMedium: input.utmMedium || null,
          utmCampaign: input.utmCampaign || null,
        });

        return { success: true, leadId: lead.id };
      }),
  }),

  // Analytics router for tracking
  analytics: router({
    trackEvent: publicProcedure
      .input(z.object({
        eventType: z.string(),
        eventData: z.record(z.string(), z.unknown()).optional(),
        sessionId: z.string().optional(),
        source: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await trackAnalyticsEvent({
          eventType: input.eventType,
          eventData: input.eventData || null,
          sessionId: input.sessionId || null,
          source: input.source || null,
          utmMedium: input.utmMedium || null,
          utmCampaign: input.utmCampaign || null,
        });
        return { success: true };
      }),

    trackPageView: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        page: z.string(),
        referrer: z.string().optional(),
        source: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await trackPageView({
          sessionId: input.sessionId,
          page: input.page,
          referrer: input.referrer || null,
          source: input.source || null,
          utmMedium: input.utmMedium || null,
          utmCampaign: input.utmCampaign || null,
        });
        return { success: true };
      }),
  }),

  // Admin router for dashboard
  admin: router({
    getLeads: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      return await getLeadsWithEmailStatus();
    }),

    getAnalytics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      return await getAnalyticsSummary();
    }),

    updateBookingStatus: protectedProcedure
      .input(z.object({
        leadId: z.number(),
        hasBookedCall: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        await updateLeadBookingStatus(input.leadId, input.hasBookedCall);
        return { success: true };
      }),

    getPendingEmails: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      return await getPendingEmails();
    }),

    processEmailQueue: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      return await processEmailQueue();
    }),
  }),
});

export type AppRouter = typeof appRouter;
