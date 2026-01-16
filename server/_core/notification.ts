import { queueEmail } from "../email-service";

/**
 * Send a notification to the project owner/admin
 * Replaces the internal Manus notifyOwner API with email notifications
 */
export async function notifyOwner(params: { title: string; content: string }) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@owambe.com";
    
    // Send email to admin
    await queueEmail({
      eventName: "admin_notification",
      to: adminEmail,
      subject: `[Admin Alert] ${params.title}`,
      html: `
        <h2>${params.title}</h2>
        <p>${params.content}</p>
        <hr>
        <p><small>Sent from Owambe Platform</small></p>
      `,
    });
    
    console.log(`Admin notification sent to ${adminEmail}: ${params.title}`);
    return true;
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    return false;
  }
}
