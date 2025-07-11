import { FastifyInstance } from "fastify"

import { verifyJWT } from "@/http/middlewares/verify-jwt"
import { nearby } from "./nearby"
import { create } from "./create"

export async function gymRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJWT)
    app.get("/gyms/nearby", nearby)
    app.post("/gyms", create)
}