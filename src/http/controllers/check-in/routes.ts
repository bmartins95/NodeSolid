import { FastifyInstance } from "fastify"

import { verifyJWT } from "@/http/middlewares/verify-jwt"
import { create } from "./create"
import { validate } from "./validate"
import { history } from "./history"

export async function checkInRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJWT)

    app.post("/gyms/:gymId/check-ins", create)
    app.patch("/check-ins/:checkInId/validate", validate)
    app.get("/check-ins/history", history)
}