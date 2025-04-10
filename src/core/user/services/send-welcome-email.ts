import {
  createEmailParams,
  replacePlaceholders,
  sendOrLogEmail,
} from "../../../application/services/mailer/mailer-service";

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
