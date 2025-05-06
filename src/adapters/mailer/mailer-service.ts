import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { ADMIN_SENDER, MAILER_KEY, NODE_ENV } from "@/settings";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mailerSend = new MailerSend({
  apiKey: MAILER_KEY,
});

interface EmailInput {
  recipient: string;
  subject: string;
  htmlContent: string;
}

export function createEmailParams({
  recipient,
  subject,
  htmlContent,
}: EmailInput): EmailParams {
  const sentFrom = new Sender(ADMIN_SENDER, "unifique");
  const recipients = [new Recipient(recipient)];

  return new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml(htmlContent);
}

export async function sendOrLogEmail(emailParams: EmailParams): Promise<void> {
  if (NODE_ENV === "prod") {
    try {
      await mailerSend.email.send(emailParams);
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  } else {
    console.log("📧 Email preview (not sent in non-prod env):");
    console.log("From:", emailParams.from.email);
    console.log("To:", emailParams.to.map((r) => r.email).join(", "));
    console.log("Subject:", emailParams.subject);
    console.log("HTML Content:", emailParams.html);
  }
}

export function replacePlaceholders(
  emailTemplateName: string,
  replacements: Record<string, string>
): string {
  const emailTemplatePath = path.join(
    __dirname,
    "..",
    "assets",
    `${emailTemplateName}.html`
  );

  if (!fs.existsSync(emailTemplatePath)) {
    throw new Error(`Email template not found: ${emailTemplatePath}`);
  }

  const template = fs.readFileSync(emailTemplatePath, "utf-8");

  return Object.entries(replacements).reduce((result, [placeholder, value]) => {
    return result.replace(new RegExp(`\\[${placeholder}\\]`, "g"), value);
  }, template);
}
