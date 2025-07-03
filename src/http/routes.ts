import { FastifyInstance } from "fastify"

import { register } from "./controller/register-controller"

export async function routes(app: FastifyInstance) {
    app.post("/users", register)
}