import { CustomerController } from "@/infra/http/customer/customer.controller";
function routes(fastify, options, done) {
    const customerController = new CustomerController();
    fastify.post("/customers", customerController.create);
    fastify.get("/customers", ()=>{
        return {
            message: "List of customers"
        };
    });
    done();
}
export default routes;

//# sourceMappingURL=routes.js.map