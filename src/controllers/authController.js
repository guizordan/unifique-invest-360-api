import { cookieSettings } from "../consts/index.js";
import { sendPasswordRecoveryEmail } from "../helpers/mailer.js";
import { PasswordRecovery, User } from "../models/index.js";

export async function login(req, reply) {
  const {
    session: { encryptedSessionId },
    body: { keepAlive = true },
    user,
  } = req;
  const { email, fullName, bankAccount, role } = user;

  if (keepAlive) {
    reply.cookie("session", encryptedSessionId, {
      path: cookieSettings.path,
      httpOnly: cookieSettings.httpOnly,
      sameSite: cookieSettings.sameSite,
      secure: cookieSettings.secure,
      expires: new Date(Date.now() + cookieSettings.maxAge),
    });
  }

  reply.send({
    data: { email, fullName, bankAccount, role },
  });
}

export async function getAuthenticatedUser(req, reply) {
  try {
    if (!req.isAuthenticated() || !req.user) {
      throw new Error("Você saiu.");
    }

    reply.send({
      data: req.user,
    });
  } catch (error) {
    reply.code(401).send({ message: "Você saiu." });
  }
}

export function logout(req, reply) {
  req.session.destroy();
  reply.clearCookie("session").send({ success: true });
}

export async function createUser(req, reply) {
  const {
    email,
    phone,
    firstName,
    lastName,
    password,
    bankAccount = "",
    role,
  } = req.body;

  const newUser = await User.create({
    email,
    phone,
    firstName,
    lastName,
    password,
    bankAccount,
    role,
  });

  reply.code(201).send(newUser);
}

export async function requestPasswordRecovery(req, reply) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw Error("Usuário não encontrado");
    }

    const pwdRecovery = await PasswordRecovery.create({ userId: user.id });
    await sendPasswordRecoveryEmail({
      recipient: user.email,
      firstName: user.firstName,
      token: pwdRecovery.token,
    });

    return reply.send({
      message:
        "Sucesso! Verifique sua caixa de entrada, ou pasta de spam pelo e-mail de recuperação de senha.",
    });
  } catch (error) {
    reply.code(400).send({
      success: false,
      message: error.message || "Ocorreu um problema com a sua requisição",
    });
  }
}

export async function updatePassword(req, reply) {
  const { token, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    return reply.send({
      success: false,
      message: "As senhas não coincidem.",
    });
  }

  try {
    const pwdRecovery = await PasswordRecovery.findOne({
      where: { token, expiredAt: null, claimedAt: null },
    });

    if (!pwdRecovery) {
      throw Error("O Token de recuperação de senha é inválido ou expirou.");
    }

    const user = await User.findOne({ where: { id: pwdRecovery.userId } });

    if (!user) {
      throw Error("Usuário não encontrado.");
    }

    user.password = password;
    await user.save();

    pwdRecovery.claimedAt = new Date();
    await pwdRecovery.save();

    reply.send({
      message: "Sua senha foi atualizada!",
    });
  } catch (error) {
    reply.code(400).send({
      success: false,
      message: error.message || "Ocorreu um problema com a sua requisição",
    });
  }
}
