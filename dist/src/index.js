import fastifyApp from "@/infra/http/server";
const PORT = process.env.PORT || 3000;
const ADDRESS = "0.0.0.0";
fastifyApp.listen({
    port: Number(PORT),
    host: ADDRESS
}, (err, address)=>{
    if (err) {
        fastifyApp.log.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});

//# sourceMappingURL=index.js.map