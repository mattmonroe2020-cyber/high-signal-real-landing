import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads table for email capture form submissions
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  company: varchar("company", { length: 200 }),
  stage: mysqlEnum("stage", ["pre-seed", "seed", "series-a", "other"]),
  isNeurodivergent: boolean("isNeurodivergent").default(false),
  source: varchar("source", { length: 100 }), // utm_source or referrer
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 100 }),
  hasBookedCall: boolean("hasBookedCall").default(false),
  bookedCallAt: timestamp("bookedCallAt"),
  playbookSentAt: timestamp("playbookSentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Email sequences for follow-up automation
 */
export const emailSequences = mysqlTable("email_sequences", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  sequenceNumber: int("sequenceNumber").notNull(), // 1, 2, 3 for follow-up emails
  emailType: mysqlEnum("emailType", ["playbook", "followup-1", "followup-2", "followup-3"]).notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  scheduledFor: timestamp("scheduledFor").notNull(),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailSequence = typeof emailSequences.$inferSelect;
export type InsertEmailSequence = typeof emailSequences.$inferInsert;

/**
 * Analytics events for tracking user interactions
 */
export const analyticsEvents = mysqlTable("analytics_events", {
  id: int("id").autoincrement().primaryKey(),
  eventType: varchar("eventType", { length: 50 }).notNull(), // page_view, cta_click, form_submit, etc.
  eventData: json("eventData"), // Additional event metadata
  sessionId: varchar("sessionId", { length: 64 }),
  leadId: int("leadId"),
  source: varchar("source", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 100 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;

/**
 * Page views for traffic analytics
 */
export const pageViews = mysqlTable("page_views", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  page: varchar("page", { length: 200 }).notNull(),
  referrer: text("referrer"),
  source: varchar("source", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;
