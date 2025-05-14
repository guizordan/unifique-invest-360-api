import { createEmailParams, replacePlaceholders, sendOrLogEmail } from "@/adapters/mailer/mailer-service";
import { WEB_URL } from "@/settings";
export async function sendWelcomeEmail({ recipient, firstName }) {
    const replacements = {
        WEB_URL,
        FirstName: firstName
    };
    const replacedTemplate = replacePlaceholders("welcome-email", replacements);
    const emailParams = createEmailParams({
        recipient,
        subject: `Seja bem-vindo, ${firstName}!`,
        htmlContent: replacedTemplate
    });
    await sendOrLogEmail(emailParams);
}

//# sourceMappingURL=send-welcome-email.js.map