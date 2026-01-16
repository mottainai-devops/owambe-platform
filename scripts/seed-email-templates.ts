import { db } from "../server/db";
import { emailEvents } from "../drizzle/schema";
import { nanoid } from "nanoid";

const templates = [
  {
    eventName: "user_registration",
    eventLabel: "User Registration",
    eventDescription: "Sent when a new user registers",
    recipientType: "user",
    subject: "Welcome to Owambe - Verify your email",
    htmlTemplate: `
      <h1>Welcome to Owambe!</h1>
      <p>Hi {{name}},</p>
      <p>Thanks for joining Owambe, the premier event booking platform.</p>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="{{verificationLink}}">Verify Email</a></p>
    `,
  },
  {
    eventName: "booking_confirmation",
    eventLabel: "Booking Confirmation",
    eventDescription: "Sent when a booking is confirmed",
    recipientType: "user",
    subject: "Booking Confirmed: {{bookingReference}}",
    htmlTemplate: `
      <h1>Booking Confirmed!</h1>
      <p>Hi {{name}},</p>
      <p>Your booking for <strong>{{itemName}}</strong> has been confirmed.</p>
      <p><strong>Date:</strong> {{date}}</p>
      <p><strong>Amount:</strong> {{amount}}</p>
      <p>You can view your booking details in your dashboard.</p>
    `,
  },
  {
    eventName: "partner_application_received",
    eventLabel: "Partner Application Received",
    eventDescription: "Sent when a partner submits an application",
    recipientType: "partner",
    subject: "We've received your partner application",
    htmlTemplate: `
      <h1>Application Received</h1>
      <p>Hi {{companyName}},</p>
      <p>Thanks for applying to become an Owambe partner.</p>
      <p>Our team will review your application and get back to you within 24-48 hours.</p>
    `,
  },
  {
    eventName: "partner_approved",
    eventLabel: "Partner Application Approved",
    eventDescription: "Sent when a partner application is approved",
    recipientType: "partner",
    subject: "Congratulations! Your Owambe Partner Account is Approved",
    htmlTemplate: `
      <h1>Welcome Aboard!</h1>
      <p>Hi {{companyName}},</p>
      <p>We are pleased to inform you that your partner application has been approved.</p>
      <p>You can now log in to your partner dashboard and start listing your services.</p>
      <p><a href="{{dashboardLink}}">Go to Dashboard</a></p>
    `,
  },
  {
    eventName: "partner_rejected",
    eventLabel: "Partner Application Rejected",
    eventDescription: "Sent when a partner application is rejected",
    recipientType: "partner",
    subject: "Update on your Owambe Partner Application",
    htmlTemplate: `
      <h1>Application Update</h1>
      <p>Hi {{companyName}},</p>
      <p>Thank you for your interest in becoming an Owambe partner.</p>
      <p>After careful review, we are unable to approve your application at this time.</p>
      <p><strong>Reason:</strong> {{reason}}</p>
    `,
  },
  {
    eventName: "admin_notification",
    eventLabel: "Admin Notification",
    eventDescription: "System alerts for admins",
    recipientType: "admin",
    subject: "[Admin Alert] {{title}}",
    htmlTemplate: `
      <h2>{{title}}</h2>
      <p>{{content}}</p>
      <hr>
      <p><small>Sent from Owambe Platform System</small></p>
    `,
  },
];

async function main() {
  console.log("Seeding email templates...");

  for (const t of templates) {
    // Check if exists
    const existing = await db.query.emailEvents.findFirst({
      where: (events, { eq }) => eq(events.eventName, t.eventName),
    });

    if (!existing) {
      await db.insert(emailEvents).values({
        id: nanoid(),
        ...t,
        recipientType: t.recipientType as any,
      });
      console.log(`Created template: ${t.eventName}`);
    } else {
      console.log(`Template exists: ${t.eventName}`);
    }
  }

  console.log("Email templates seeded successfully.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
