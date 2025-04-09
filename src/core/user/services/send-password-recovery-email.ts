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
