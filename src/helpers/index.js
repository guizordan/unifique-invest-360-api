import { promisify } from "util";
import { exec } from "child_process";

import passport from "./passport.js";

const BASE62_ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const execAsync = promisify(exec);

export function isHttpErrorCode(code) {
  return code >= 400 && code <= 599;
}

export const OrderStatusEnum = {
  CREATED: "created",
  APPROVED: "approved",
  EXECUTED: "executed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const ProductEnum = {
  CCM: "CCM",
  SJC: "SJC",
  WDO: "WDO",
};

export async function getLatestCommitHash() {
  try {
    const { stdout } = await execAsync("git rev-parse --short HEAD");
    const hash = stdout.trim();
    return hash;
  } catch (error) {
    throw new Error("Failed to retrieve commit hash");
  }
}

function encodeBase62(number) {
  let base62 = "";
  while (number > 0) {
    const remainder = number % 62;
    base62 = BASE62_ALPHABET[remainder] + base62;
    number = Math.floor(number / 62);
  }
  return base62 || "0";
}

function decodeBase62(base62) {
  let number = 0;
  for (let i = 0; i < base62.length; i++) {
    number = number * 62 + BASE62_ALPHABET.indexOf(base62[i]);
  }
  return number;
}

function parseDate(dateString) {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
  if (!regex.test(dateString)) {
    throw new Error("Invalid date format. Expected dd/mm/yyyy.");
  }

  const [day, month, year] = dateString.split("/").map(Number);

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    throw new Error("Invalid date value.");
  }

  return date;
}

function translate(value) {
  return (
    {
      CCM: "Milho",
      SJC: "Soja",
      WDO: "Dólar",
      BUY: "Compra",
      SELL: "Venda",
      NEUTRAL: "Neutro",
      customer: "Cliente",
      backoffice: "Backoffice",
      admin: "Administrador",
    }[value] || ""
  );
}

function formatToMil(number) {
  if (number < 1000) return number.toString();
  const milValue = Math.floor(number / 1000);
  return `${milValue} mil`;
}

function formatWithPeriod(number) {
  return number.toLocaleString("pt-BR");
}

function translateQtd({ quantity, product }) {
  if (product === "WDO") {
    return formatToMil(quantity);
  }

  return formatWithPeriod(quantity) + " sacas";
}

export { sendWelcomeEmail, sendPasswordRecoveryEmail } from "./mailer.js";

export {
  passport,
  encodeBase62,
  decodeBase62,
  parseDate,
  translate,
  translateQtd,
};
