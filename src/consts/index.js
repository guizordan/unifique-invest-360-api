export const NODE_ENV = process.env.NODE_ENV || "prod";

const sameSite = {
  prod: "Strict",
  test: "None",
  local: "Lax",
}[NODE_ENV];

const secure = NODE_ENV === "local" ? false : true;

export const cookieSettings = {
  path: "/",
  httpOnly: true,
  maxAge: 7200000,
  sameSite,
  secure,
};
