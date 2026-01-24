import { getEmailTemplate } from "./emailTemplates";
import { getPendingEmails, updateEmailStatus, updateLeadPlaybookSent } from "./db";
import { notifyOwner } from "./_core/notification";

// Placeholder for the playbook PDF URL - to be updated with actual S3 URL
const PLAYBOOK_PDF_URL = "[TBD - will add post-build]";

/**
 * Process pending emails in the queue
 * This function should be called periodically (e.g., via cron job or scheduled task)
 */
export async function processEmailQueue(): Promise<{
  processed: number;
  sent: number;
  failed: number;
}> {
  const pendingEmails = await getPendingEmails();
  
  let processed = 0;
  let sent = 0;
  let failed = 0;

  for (const email of pendingEmails) {
    processed++;
    
    try {
      const template = getEmailTemplate(
        email.emailType,
        email.lead.firstName,
        email.emailType === "playbook" ? PLAYBOOK_PDF_URL : undefined
      );

      // For now, we'll use the notification system to alert the owner
      // In production, this would integrate with an email service like SendGrid, Mailchimp, etc.
      const success = await sendEmail({
        to: email.lead.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (success) {
        await updateEmailStatus(email.id, "sent");
        
        // Update playbook sent timestamp if this is the playbook email
        if (email.emailType === "playbook") {
          await updateLeadPlaybookSent(email.leadId);
        }
        
        sent++;
      } else {
        await updateEmailStatus(email.id, "failed");
        failed++;
      }
    } catch (error) {
      console.error(`Failed to process email ${email.id}:`, error);
      await updateEmailStatus(email.id, "failed");
      failed++;
    }
  }

  // Notify owner if there were any emails processed
  if (processed > 0) {
    await notifyOwner({
      title: "Email Queue Processed",
      content: `Processed ${processed} emails: ${sent} sent, ${failed} failed.`,
    });
  }

  return { processed, sent, failed };
}

/**
 * Send an email using the configured email service
 * Currently uses a placeholder implementation - integrate with your email provider
 */
async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  // TODO: Integrate with email service (Mailchimp, SendGrid, ConvertKit, etc.)
  // For now, log the email and notify the owner
  
  console.log(`[Email Service] Would send email to ${params.to}:`);
  console.log(`  Subject: ${params.subject}`);
  
  // Notify owner about the email that would be sent
  try {
    await notifyOwner({
      title: `Email Ready: ${params.subject}`,
      content: `To: ${params.to}\n\nThis email is queued for sending. Configure your email service to enable automatic delivery.`,
    });
    return true;
  } catch (error) {
    console.error("[Email Service] Failed to notify owner:", error);
    return false;
  }
}

/**
 * Manually trigger sending an email to a specific lead
 */
export async function sendImmediateEmail(
  leadId: number,
  emailType: "playbook" | "followup-1" | "followup-2" | "followup-3",
  lead: { firstName: string; email: string }
): Promise<boolean> {
  try {
    const template = getEmailTemplate(
      emailType,
      lead.firstName,
      emailType === "playbook" ? PLAYBOOK_PDF_URL : undefined
    );

    return await sendEmail({
      to: lead.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } catch (error) {
    console.error(`Failed to send immediate email to ${lead.email}:`, error);
    return false;
  }
}
