import fastifyApp from "@/infra/http/server";
import { getAccessToken } from "./azure";

import "reflect-metadata";

const PORT = process.env.PORT || 3000;
const ADDRESS = "0.0.0.0";

const accessToken = await getAccessToken();

fastifyApp.listen({ port: Number(PORT), host: ADDRESS }, (err, address) => {
  if (err) {
    fastifyApp.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
