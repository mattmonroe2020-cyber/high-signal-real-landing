import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getLeadByEmail: vi.fn(),
  createLead: vi.fn(),
  createEmailSequence: vi.fn(),
  trackAnalyticsEvent: vi.fn(),
  getAllLeads: vi.fn(),
  getLeadsWithEmailStatus: vi.fn(),
  updateLeadBookingStatus: vi.fn(),
  getPendingEmails: vi.fn(),
  getAnalyticsSummary: vi.fn(),
  trackPageView: vi.fn(),
}));

// Mock the email service
vi.mock("./emailService", () => ({
  processEmailQueue: vi.fn(),
  sendImmediateEmail: vi.fn(),
}));

import { 
  getLeadByEmail, 
  createLead, 
  createEmailSequence, 
  trackAnalyticsEvent 
} from "./db";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("leads.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new lead and schedules email sequence", async () => {
    const mockLead = {
      id: 1,
      firstName: "Test",
      email: "test@example.com",
      company: "Test Co",
      stage: "seed" as const,
      isNeurodivergent: true,
      source: null,
      utmMedium: null,
      utmCampaign: null,
      hasBookedCall: false,
      bookedCallAt: null,
      playbookSentAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(getLeadByEmail).mockResolvedValue(undefined);
    vi.mocked(createLead).mockResolvedValue(mockLead);
    vi.mocked(createEmailSequence).mockResolvedValue(undefined);
    vi.mocked(trackAnalyticsEvent).mockResolvedValue(undefined);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.submit({
      firstName: "Test",
      email: "test@example.com",
      company: "Test Co",
      stage: "seed",
      isNeurodivergent: true,
    });

    expect(result).toEqual({ success: true, leadId: 1 });
    expect(getLeadByEmail).toHaveBeenCalledWith("test@example.com");
    expect(createLead).toHaveBeenCalledWith({
      firstName: "Test",
      email: "test@example.com",
      company: "Test Co",
      stage: "seed",
      isNeurodivergent: true,
      source: null,
      utmMedium: null,
      utmCampaign: null,
    });
    
    // Should create 4 email sequences (playbook + 3 follow-ups)
    expect(createEmailSequence).toHaveBeenCalledTimes(4);
    
    // Should track analytics event
    expect(trackAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "form_submit",
        eventData: { formType: "playbook_download" },
        leadId: 1,
      })
    );
  });

  it("rejects duplicate email submissions", async () => {
    const existingLead = {
      id: 1,
      firstName: "Existing",
      email: "existing@example.com",
      company: null,
      stage: null,
      isNeurodivergent: false,
      source: null,
      utmMedium: null,
      utmCampaign: null,
      hasBookedCall: false,
      bookedCallAt: null,
      playbookSentAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(getLeadByEmail).mockResolvedValue(existingLead);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submit({
        firstName: "Test",
        email: "existing@example.com",
      })
    ).rejects.toThrow("You've already downloaded the playbook");

    expect(createLead).not.toHaveBeenCalled();
  });

  it("validates required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Missing firstName
    await expect(
      caller.leads.submit({
        firstName: "",
        email: "test@example.com",
      })
    ).rejects.toThrow();

    // Invalid email
    await expect(
      caller.leads.submit({
        firstName: "Test",
        email: "not-an-email",
      })
    ).rejects.toThrow();
  });
});

describe("analytics.trackEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("tracks analytics events", async () => {
    vi.mocked(trackAnalyticsEvent).mockResolvedValue(undefined);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analytics.trackEvent({
      eventType: "cta_click",
      eventData: { button: "book_call" },
      sessionId: "test-session",
    });

    expect(result).toEqual({ success: true });
    expect(trackAnalyticsEvent).toHaveBeenCalledWith({
      eventType: "cta_click",
      eventData: { button: "book_call" },
      sessionId: "test-session",
      source: null,
      utmMedium: null,
      utmCampaign: null,
    });
  });
});
