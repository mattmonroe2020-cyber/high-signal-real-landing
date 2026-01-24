// Email templates for High Signal Coaching

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

const BRAND_COLOR = "#A86030";
const CALENDLY_LINK = "[TBD - will add post-build]";

export function getPlaybookEmail(firstName: string, playbookUrl: string): EmailTemplate {
  return {
    subject: "Your Milestone Predictability Playbook is here",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #202020; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #202020; font-size: 24px; margin: 0;">HIGH SIGNAL COACHING</h1>
    <div style="width: 100px; height: 3px; background: ${BRAND_COLOR}; margin: 10px auto;"></div>
  </div>
  
  <p>Hey ${firstName},</p>
  
  <p>Thanks for downloading <strong>The Milestone Predictability Playbook</strong>.</p>
  
  <p>Inside, you'll find:</p>
  <ul style="color: #444;">
    <li>The High Signal Framework for mapping internal resistance</li>
    <li>Fillable parts-map templates</li>
    <li>A 2-week scaffold experiment with measurement plan</li>
    <li>ROI calculator for milestone predictability</li>
  </ul>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${playbookUrl}" style="display: inline-block; background: ${BRAND_COLOR}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">Download Your Playbook</a>
  </div>
  
  <p>This playbook is designed for neurodivergent founders who know what to do but struggle with consistent execution. The frameworks inside have helped founders reduce milestone slips by 40% on average.</p>
  
  <p><strong>Want to accelerate your results?</strong></p>
  
  <p>Book a free 30-minute Founder Diagnostic call. We'll identify your top execution blocker and create a concrete plan for your next milestone.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${CALENDLY_LINK}" style="display: inline-block; border: 2px solid ${BRAND_COLOR}; color: ${BRAND_COLOR}; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Book Your Diagnostic Call</a>
  </div>
  
  <p>To your predictable execution,</p>
  <p><strong>Matt</strong><br>High Signal Coaching</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #888;">
    High Signal Coaching | matt@highsignalcoaching.com<br>
    Professional coaching services, not therapy or clinical treatment.
  </p>
</body>
</html>
    `.trim(),
    text: `
Hey ${firstName},

Thanks for downloading The Milestone Predictability Playbook.

Inside, you'll find:
- The High Signal Framework for mapping internal resistance
- Fillable parts-map templates
- A 2-week scaffold experiment with measurement plan
- ROI calculator for milestone predictability

Download your playbook here: ${playbookUrl}

This playbook is designed for neurodivergent founders who know what to do but struggle with consistent execution. The frameworks inside have helped founders reduce milestone slips by 40% on average.

Want to accelerate your results?

Book a free 30-minute Founder Diagnostic call. We'll identify your top execution blocker and create a concrete plan for your next milestone.

Book your call: ${CALENDLY_LINK}

To your predictable execution,
Matt
High Signal Coaching

---
High Signal Coaching | matt@highsignalcoaching.com
Professional coaching services, not therapy or clinical treatment.
    `.trim(),
  };
}

export function getFollowUp1Email(firstName: string): EmailTemplate {
  return {
    subject: "Quick question about your execution blockers",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #202020; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Hey ${firstName},</p>
  
  <p>I wanted to follow up on the Milestone Predictability Playbook you downloaded.</p>
  
  <p>Have you had a chance to identify your top execution blocker yet?</p>
  
  <p>In my experience working with neurodivergent founders, the most common blockers fall into three categories:</p>
  
  <ol style="color: #444;">
    <li><strong>The Perfectionist Part</strong> — delays shipping until everything is "just right"</li>
    <li><strong>The Protector Part</strong> — creates busy work to avoid high-stakes decisions</li>
    <li><strong>The Rescue Part</strong> — constantly jumps to help others instead of your own priorities</li>
  </ol>
  
  <p>Sound familiar?</p>
  
  <p>If you're curious which pattern is most affecting your execution velocity, I'd love to help you figure it out.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${CALENDLY_LINK}" style="display: inline-block; background: ${BRAND_COLOR}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">Book a Free Diagnostic Call</a>
  </div>
  
  <p>In 30 minutes, we'll identify your specific blocker and create a concrete plan for your next milestone.</p>
  
  <p>Talk soon,</p>
  <p><strong>Matt</strong></p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #888;">
    High Signal Coaching | matt@highsignalcoaching.com
  </p>
</body>
</html>
    `.trim(),
    text: `
Hey ${firstName},

I wanted to follow up on the Milestone Predictability Playbook you downloaded.

Have you had a chance to identify your top execution blocker yet?

In my experience working with neurodivergent founders, the most common blockers fall into three categories:

1. The Perfectionist Part — delays shipping until everything is "just right"
2. The Protector Part — creates busy work to avoid high-stakes decisions
3. The Rescue Part — constantly jumps to help others instead of your own priorities

Sound familiar?

If you're curious which pattern is most affecting your execution velocity, I'd love to help you figure it out.

Book a free diagnostic call: ${CALENDLY_LINK}

In 30 minutes, we'll identify your specific blocker and create a concrete plan for your next milestone.

Talk soon,
Matt

---
High Signal Coaching | matt@highsignalcoaching.com
    `.trim(),
  };
}

export function getFollowUp2Email(firstName: string): EmailTemplate {
  return {
    subject: "The real cost of unpredictable execution",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #202020; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Hey ${firstName},</p>
  
  <p>I've been thinking about something that might resonate with you.</p>
  
  <p>When I talk to founders about execution challenges, they often underestimate the real cost:</p>
  
  <ul style="color: #444;">
    <li><strong>Team trust erodes</strong> when deadlines slip repeatedly</li>
    <li><strong>Investor confidence drops</strong> when milestones become unpredictable</li>
    <li><strong>Personal burnout accelerates</strong> from the constant push-crash cycle</li>
    <li><strong>Opportunity cost compounds</strong> as competitors ship faster</li>
  </ul>
  
  <p>The good news? These patterns are fixable.</p>
  
  <p>The Self-Led Founder Protocol I've developed combines IFS parts work with practical execution scaffolding. It's specifically designed for how neurodivergent brains actually work—not neurotypical productivity templates that never stick.</p>
  
  <p><strong>Results from recent clients:</strong></p>
  <ul style="color: #444;">
    <li>40% reduction in milestone slips</li>
    <li>60% improvement in decision velocity</li>
    <li>Sustainable execution without burnout cycles</li>
  </ul>
  
  <p>If you're ready to make your milestones predictable, let's talk.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${CALENDLY_LINK}" style="display: inline-block; background: ${BRAND_COLOR}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">Schedule Your Founder Diagnostic</a>
  </div>
  
  <p>Best,</p>
  <p><strong>Matt</strong></p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #888;">
    High Signal Coaching | matt@highsignalcoaching.com
  </p>
</body>
</html>
    `.trim(),
    text: `
Hey ${firstName},

I've been thinking about something that might resonate with you.

When I talk to founders about execution challenges, they often underestimate the real cost:

- Team trust erodes when deadlines slip repeatedly
- Investor confidence drops when milestones become unpredictable
- Personal burnout accelerates from the constant push-crash cycle
- Opportunity cost compounds as competitors ship faster

The good news? These patterns are fixable.

The Self-Led Founder Protocol I've developed combines IFS parts work with practical execution scaffolding. It's specifically designed for how neurodivergent brains actually work—not neurotypical productivity templates that never stick.

Results from recent clients:
- 40% reduction in milestone slips
- 60% improvement in decision velocity
- Sustainable execution without burnout cycles

If you're ready to make your milestones predictable, let's talk.

Schedule your diagnostic: ${CALENDLY_LINK}

Best,
Matt

---
High Signal Coaching | matt@highsignalcoaching.com
    `.trim(),
  };
}

export function getFollowUp3Email(firstName: string): EmailTemplate {
  return {
    subject: "Last chance: Beta spots closing soon",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #202020; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Hey ${firstName},</p>
  
  <p>Quick heads up: I'm closing the beta cohort for the Self-Led Founder Protocol soon.</p>
  
  <p>Here's what you'd get:</p>
  
  <ul style="color: #444;">
    <li>8 weeks of structured coaching designed for neurodivergent founders</li>
    <li>Biweekly 1:1 sessions + weekly group accountability</li>
    <li>IFS parts mapping + custom execution scaffolding</li>
    <li>Access to the Black Book curriculum + template vault</li>
    <li>Between-session async support</li>
  </ul>
  
  <p><strong>Beta investment: $1,500</strong> (regular price will be $3,000)</p>
  
  <p>Limited to 10 founders. If execution consistency is costing you—in team trust, investor confidence, or personal wellbeing—this is your chance to fix it with a system built for your brain.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${CALENDLY_LINK}" style="display: inline-block; background: ${BRAND_COLOR}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">Claim Your Beta Spot</a>
  </div>
  
  <p>No pressure if the timing isn't right. But if you've been thinking about it, now's the time to act.</p>
  
  <p>To your predictable milestones,</p>
  <p><strong>Matt</strong></p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #888;">
    High Signal Coaching | matt@highsignalcoaching.com<br>
    <a href="#" style="color: #888;">Unsubscribe</a>
  </p>
</body>
</html>
    `.trim(),
    text: `
Hey ${firstName},

Quick heads up: I'm closing the beta cohort for the Self-Led Founder Protocol soon.

Here's what you'd get:

- 8 weeks of structured coaching designed for neurodivergent founders
- Biweekly 1:1 sessions + weekly group accountability
- IFS parts mapping + custom execution scaffolding
- Access to the Black Book curriculum + template vault
- Between-session async support

Beta investment: $1,500 (regular price will be $3,000)

Limited to 10 founders. If execution consistency is costing you—in team trust, investor confidence, or personal wellbeing—this is your chance to fix it with a system built for your brain.

Claim your beta spot: ${CALENDLY_LINK}

No pressure if the timing isn't right. But if you've been thinking about it, now's the time to act.

To your predictable milestones,
Matt

---
High Signal Coaching | matt@highsignalcoaching.com
Unsubscribe: [link]
    `.trim(),
  };
}

export function getEmailTemplate(
  emailType: "playbook" | "followup-1" | "followup-2" | "followup-3",
  firstName: string,
  playbookUrl?: string
): EmailTemplate {
  switch (emailType) {
    case "playbook":
      return getPlaybookEmail(firstName, playbookUrl || "#");
    case "followup-1":
      return getFollowUp1Email(firstName);
    case "followup-2":
      return getFollowUp2Email(firstName);
    case "followup-3":
      return getFollowUp3Email(firstName);
    default:
      throw new Error(`Unknown email type: ${emailType}`);
  }
}
