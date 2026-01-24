import { eq, desc, sql, and, lte, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  leads, 
  InsertLead, 
  Lead,
  emailSequences,
  InsertEmailSequence,
  EmailSequence,
  analyticsEvents,
  InsertAnalyticsEvent,
  pageViews,
  InsertPageView
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== LEADS ====================

export async function createLead(data: {
  firstName: string;
  email: string;
  company: string | null;
  stage: "pre-seed" | "seed" | "series-a" | "other" | null;
  isNeurodivergent: boolean;
  source: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}): Promise<Lead> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(leads).values({
    firstName: data.firstName,
    email: data.email,
    company: data.company,
    stage: data.stage,
    isNeurodivergent: data.isNeurodivergent,
    source: data.source,
    utmMedium: data.utmMedium,
    utmCampaign: data.utmCampaign,
  });

  const insertId = result[0].insertId;
  const [lead] = await db.select().from(leads).where(eq(leads.id, insertId));
  return lead;
}

export async function getLeadByEmail(email: string): Promise<Lead | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(leads).where(eq(leads.email, email)).limit(1);
  return result[0];
}

export async function getAllLeads(): Promise<Lead[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function updateLeadBookingStatus(leadId: number, hasBookedCall: boolean): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(leads)
    .set({ 
      hasBookedCall, 
      bookedCallAt: hasBookedCall ? new Date() : null 
    })
    .where(eq(leads.id, leadId));
}

export async function updateLeadPlaybookSent(leadId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(leads)
    .set({ playbookSentAt: new Date() })
    .where(eq(leads.id, leadId));
}

// ==================== EMAIL SEQUENCES ====================

export async function createEmailSequence(data: {
  leadId: number;
  sequenceNumber: number;
  emailType: "playbook" | "followup-1" | "followup-2" | "followup-3";
  scheduledFor: Date;
}): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(emailSequences).values({
    leadId: data.leadId,
    sequenceNumber: data.sequenceNumber,
    emailType: data.emailType,
    scheduledFor: data.scheduledFor,
    status: "pending",
  });
}

export async function getPendingEmails(): Promise<(EmailSequence & { lead: Lead })[]> {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  const result = await db
    .select()
    .from(emailSequences)
    .innerJoin(leads, eq(emailSequences.leadId, leads.id))
    .where(
      and(
        eq(emailSequences.status, "pending"),
        lte(emailSequences.scheduledFor, now)
      )
    )
    .orderBy(emailSequences.scheduledFor);

  return result.map(r => ({
    ...r.email_sequences,
    lead: r.leads,
  }));
}

export async function updateEmailStatus(
  emailId: number, 
  status: "pending" | "sent" | "failed"
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(emailSequences)
    .set({ 
      status, 
      sentAt: status === "sent" ? new Date() : null 
    })
    .where(eq(emailSequences.id, emailId));
}

// ==================== ANALYTICS ====================

export async function trackAnalyticsEvent(data: {
  eventType: string;
  eventData: Record<string, unknown> | null;
  sessionId?: string | null;
  leadId?: number | null;
  source: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(analyticsEvents).values({
    eventType: data.eventType,
    eventData: data.eventData,
    sessionId: data.sessionId || null,
    leadId: data.leadId || null,
    source: data.source,
    utmMedium: data.utmMedium,
    utmCampaign: data.utmCampaign,
  });
}

export async function trackPageView(data: {
  sessionId: string;
  page: string;
  referrer: string | null;
  source: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(pageViews).values({
    sessionId: data.sessionId,
    page: data.page,
    referrer: data.referrer,
    source: data.source,
    utmMedium: data.utmMedium,
    utmCampaign: data.utmCampaign,
  });
}

export async function getAnalyticsSummary(): Promise<{
  totalLeads: number;
  totalPageViews: number;
  totalBookings: number;
  conversionRate: number;
  leadsByStage: { stage: string; count: number }[];
  leadsBySource: { source: string; count: number }[];
  recentEvents: { eventType: string; count: number; date: string }[];
}> {
  const db = await getDb();
  if (!db) {
    return {
      totalLeads: 0,
      totalPageViews: 0,
      totalBookings: 0,
      conversionRate: 0,
      leadsByStage: [],
      leadsBySource: [],
      recentEvents: [],
    };
  }

  // Total leads
  const [leadsCount] = await db.select({ count: count() }).from(leads);
  const totalLeads = leadsCount?.count || 0;

  // Total page views
  const [pageViewsCount] = await db.select({ count: count() }).from(pageViews);
  const totalPageViews = pageViewsCount?.count || 0;

  // Total bookings
  const [bookingsCount] = await db
    .select({ count: count() })
    .from(leads)
    .where(eq(leads.hasBookedCall, true));
  const totalBookings = bookingsCount?.count || 0;

  // Conversion rate
  const conversionRate = totalLeads > 0 ? (totalBookings / totalLeads) * 100 : 0;

  // Leads by stage
  const stageResults = await db
    .select({
      stage: leads.stage,
      count: count(),
    })
    .from(leads)
    .groupBy(leads.stage);
  const leadsByStage = stageResults.map(r => ({
    stage: r.stage || "unknown",
    count: r.count,
  }));

  // Leads by source
  const sourceResults = await db
    .select({
      source: leads.source,
      count: count(),
    })
    .from(leads)
    .groupBy(leads.source);
  const leadsBySource = sourceResults.map(r => ({
    source: r.source || "direct",
    count: r.count,
  }));

  // Recent events (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const eventResults = await db
    .select({
      eventType: analyticsEvents.eventType,
      count: count(),
    })
    .from(analyticsEvents)
    .groupBy(analyticsEvents.eventType);
  const recentEvents = eventResults.map(r => ({
    eventType: r.eventType,
    count: r.count,
    date: new Date().toISOString().split('T')[0],
  }));

  return {
    totalLeads,
    totalPageViews,
    totalBookings,
    conversionRate,
    leadsByStage,
    leadsBySource,
    recentEvents,
  };
}

export async function getLeadsWithEmailStatus(): Promise<(Lead & { emailsSent: number; lastEmailType: string | null })[]> {
  const db = await getDb();
  if (!db) return [];

  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
  
  const result = await Promise.all(
    allLeads.map(async (lead) => {
      const sentEmails = await db
        .select()
        .from(emailSequences)
        .where(
          and(
            eq(emailSequences.leadId, lead.id),
            eq(emailSequences.status, "sent")
          )
        )
        .orderBy(desc(emailSequences.sentAt));
      
      return {
        ...lead,
        emailsSent: sentEmails.length,
        lastEmailType: sentEmails[0]?.emailType || null,
      };
    })
  );

  return result;
}
