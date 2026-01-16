import nodemailer from "nodemailer";
import { db } from "./db";
import { emailSettings, emailLogs, emailEvents } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

// Queue for processing emails
const emailQueue: Array<{
  id: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  eventName: string;
  metadata?: any;
}> = [];

let isProcessing = false;

/**
 * Get active SMTP settings from database
 */
async function getSmtpSettings() {
  const settings = await db.query.emailSettings.findFirst({
    where: eq(emailSettings.isActive, true),
  });
  return settings;
}

/**
 * Create a transporter using active settings
 */
async function createTransporter() {
  const settings = await getSmtpSettings();
  
  if (!settings) {
    throw new Error("No active SMTP settings found");
  }

  return nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort,
    secure: settings.smtpSecure, // true for 465, false for other ports
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPassword,
    },
  });
}

/**
 * Process the email queue
 */
async function processQueue() {
  if (isProcessing || emailQueue.length === 0) return;

  isProcessing = true;
  const settings = await getSmtpSettings();

  if (!settings) {
    console.error("Cannot process email queue: No SMTP settings");
    isProcessing = false;
    return;
  }

  try {
    const transporter = await createTransporter();

    while (emailQueue.length > 0) {
      const email = emailQueue.shift();
      if (!email) break;

      try {
        await transporter.sendMail({
          from: `"${settings.fromName}" <${settings.fromEmail}>`,
          to: email.to,
          replyTo: settings.replyToEmail || undefined,
          subject: email.subject,
          html: email.html,
          text: email.text,
        });

        // Update log status to sent
        await db.update(emailLogs)
          .set({ 
            status: "sent", 
            sentAt: new Date() 
          })
          .where(eq(emailLogs.id, email.id));

        console.log(`Email sent to ${email.to} (Event: ${email.eventName})`);
      } catch (error: any) {
        console.error(`Failed to send email to ${email.to}:`, error);
        
        // Update log status to failed
        await db.update(emailLogs)
          .set({ 
            status: "failed", 
            failureReason: error.message 
          })
          .where(eq(emailLogs.id, email.id));
      }

      // Rate limiting: wait 100ms between emails
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.error("Error in email queue processor:", error);
  } finally {
    isProcessing = false;
  }
}

/**
 * Queue an email to be sent
 */
export async function queueEmail(options: {
  eventName: string;
  to: string;
  recipientName?: string;
  variables?: Record<string, any>;
  subject?: string; // Override template subject
  html?: string; // Override template html
}) {
  try {
    // 1. Get the template if not provided manually
    let subject = options.subject;
    let html = options.html;
    let text = "";

    if (!subject || !html) {
      const template = await db.query.emailEvents.findFirst({
        where: eq(emailEvents.eventName, options.eventName),
      });

      if (template) {
        subject = subject || template.subject;
        html = html || template.htmlTemplate;
        text = template.textTemplate || "";
      } else if (!subject || !html) {
        throw new Error(`Email template '${options.eventName}' not found and no manual content provided`);
      }
    }

    // 2. Replace variables
    if (options.variables) {
      Object.entries(options.variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, "g");
        subject = subject!.replace(regex, String(value));
        html = html!.replace(regex, String(value));
        text = text.replace(regex, String(value));
      });
    }

    // 3. Create log entry
    const logId = nanoid();
    await db.insert(emailLogs).values({
      id: logId,
      eventName: options.eventName,
      recipientEmail: options.to,
      recipientName: options.recipientName,
      subject: subject!,
      status: "pending",
      metadata: options.variables,
    });

    // 4. Add to queue
    emailQueue.push({
      id: logId,
      to: options.to,
      subject: subject!,
      html: html!,
      text: text,
      eventName: options.eventName,
      metadata: options.variables,
    });

    // 5. Trigger processor
    processQueue();

    return { success: true, logId };
  } catch (error) {
    console.error("Error queuing email:", error);
    return { success: false, error };
  }
}

/**
 * Test SMTP connection
 */
export async function testSMTPConnection() {
  try {
    const transporter = await createTransporter();
    await transporter.verify();
    return { success: true, message: "SMTP connection successful" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
