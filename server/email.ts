/**
 * Automated Email Service Provider Module
 * Supports Resend / Nodemailer API with graceful fallback simulator
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      // Production Resend API integration
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "LearnLoop AI <welcome@learnloop.ai>",
          to: [options.to],
          subject: options.subject,
          html: options.html,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`[Email Service] Sent email successfully to ${options.to}. Message ID: ${data.id}`);
        return { success: true, id: data.id };
      }
    } catch (err) {
      console.error("[Email Service Error]", err);
    }
  }

  // Fallback simulator for dev / non-configured environments
  console.log(`\n================ [EMAIL SERVICE SIMULATOR] ================`);
  console.log(`TO: ${options.to}`);
  console.log(`SUBJECT: ${options.subject}`);
  console.log(`BODY:\n${options.html.replace(/<[^>]*>/g, " ").trim()}`);
  console.log(`============================================================\n`);

  return { success: true, id: `sim_${Date.now()}` };
}

export async function sendWaitlistConfirmation(email: string): Promise<void> {
  const subject = "Welcome to LearnLoop AI — Access Queue Confirmed";
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #f3f4f6; padding: 32px; border-radius: 12px;">
      <h2 style="color: #6366f1; font-size: 24px; margin-bottom: 16px;">Welcome to LearnLoop AI</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #d1d5db;">
        Thank you for joining the early access waitlist! We are rolling out invites in batches.
      </p>
      <div style="background: #111827; border: 1px solid #1f2937; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <h4 style="margin: 0 0 8px 0; color: #a5b4fc;">What happens next?</h4>
        <ul style="margin: 0; padding-left: 20px; color: #9ca3af; line-height: 1.6;">
          <li>Your spot in the queue is confirmed for <strong>${email}</strong>.</li>
          <li>You will get priority access to our interactive resonance engine and capture agent.</li>
        </ul>
      </div>
      <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 32px;">
        © ${new Date().getFullYear()} LearnLoop AI. All rights reserved.
      </p>
    </div>
  `;

  await sendEmail({ to: email, subject, html });
}
