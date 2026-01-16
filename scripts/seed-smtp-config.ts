import { db } from "../server/db";
import { emailSettings } from "../drizzle/schema";
import { nanoid } from "nanoid";

async function main() {
  console.log("Seeding SMTP configuration...");

  // Check if settings already exist
  const existing = await db.query.emailSettings.findFirst();
  if (existing) {
    console.log("SMTP settings already exist. Skipping.");
    return;
  }

  // Insert default Hostinger SMTP settings
  await db.insert(emailSettings).values({
    id: nanoid(),
    smtpHost: "smtp.hostinger.com",
    smtpPort: 465,
    smtpSecure: true,
    smtpUser: "noreply@owambe.com",
    smtpPassword: "ChangeMe123!", // Placeholder - must be updated in admin
    fromEmail: "noreply@owambe.com",
    fromName: "Owambe Platform",
    replyToEmail: "support@owambe.com",
    isActive: true,
  });

  console.log("SMTP configuration seeded successfully.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
