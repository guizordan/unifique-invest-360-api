import "reflect-metadata";

import fastifyApp from "@/infra/http/server";
import dataSource from "@/infra/database/dataSource";

const PORT = process.env.PORT || 3000;
const ADDRESS = "0.0.0.0";

export const initializedDataSource = await dataSource.initialize();

fastifyApp.listen({ port: Number(PORT), host: ADDRESS }, (err, address) => {
  if (err) {
    fastifyApp.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
