import fs from "fs";
import path from "path";

import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

import { translate, translateQtd } from "./index.js";

const WEB_URL = process.env.WEB_URL
  ? process.env.WEB_URL
  : "https://test.ferticred.com.br/";

const ADMIN_SENDER =
  process.env.NODE_ENV === "prod"
    ? "admin@ferticred.com.br"
    : "admin@test.ferticred.com.br";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILER_KEY,
});

export async function sendWelcomeEmail({ recipient, firstName }) {
  const replacements = {
    WEB_URL,
    FirstName: firstName,
  };

  const replacedTemplate = replacePlaceholders("welcome-email", replacements);

  const emailParams = createEmailParams({
    recipient,
    subject: `Seja bem-vindo, ${firstName}!`,
    htmlContent: replacedTemplate,
  });

  await sendOrLogEmail(emailParams);
}

export async function sendPasswordRecoveryEmail({
  recipient,
  firstName,
  token,
}) {
  const replacements = {
    WEB_URL,
    FirstName: firstName,
    RecoveryLink: WEB_URL + "auth/nova-senha?token=" + token,
  };

  const replacedTemplate = replacePlaceholders(
    "password-recovery-email",
    replacements
  );

  const emailParams = createEmailParams({
    recipient,
    subject: "Instruções para redefinir sua senha",
    htmlContent: replacedTemplate,
  });

  await sendOrLogEmail(emailParams);
}

export async function sendOrderCreatedEmail({ order, user }) {
  const { product, quantity } = order;
  const { email, fullName } = user;

  const translatedProduct = translate(product);
  const translatedQtd = translateQtd({ quantity, product });

  const replacements = {
    WEB_URL,
    Name: fullName,
    Product: translatedProduct,
    Quantity: translatedQtd,
    MyOrdersLink: WEB_URL + "dashboard/minhas-ordens",
  };

  const replacedTemplate = replacePlaceholders(
    "create-order-email",
    replacements
  );

  const subject = `Nova ordem em ${translatedProduct} foi enviada`;

  const emailParams = createEmailParams({
    recipient: email,
    subject,
    htmlContent: replacedTemplate,
  });

  await sendOrLogEmail(emailParams);
}

function createEmailParams({ recipient, subject, htmlContent }) {
  const sentFrom = new Sender(ADMIN_SENDER, "Ferticred");
  const recipients = [new Recipient(recipient)];

  return new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml(htmlContent);
}

async function sendOrLogEmail(emailParams) {
  if (process.env.NODE_ENV === "prod") {
    await mailerSend.email.send(emailParams);
  } else {
    console.log("Email would be sent with the following parameters:");
    console.log("From:", emailParams.from.email);
    console.log(
      "To:",
      emailParams.to.map((r) => r.email)
    );
    console.log("Subject:", emailParams.subject);
    console.log("HTML Content:", emailParams.html);
  }
}

function replacePlaceholders(emailTemplateName, replacements) {
  const currentDir = path.dirname(new URL(import.meta.url).pathname);
  const emailTemplatePath = path.join(
    currentDir,
    "..",
    "assets",
    `${emailTemplateName}.html`
  );
  const template = fs.readFileSync(emailTemplatePath, "utf-8");

  let result = template;
  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\[${placeholder}\\]`, "g"), value);
  }
  return result;
}
