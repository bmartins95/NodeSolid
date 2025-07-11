import { FastifyInstance } from "fastify"

import { verifyJWT } from "../../middlewares/verify-jwt"
import { authenticate } from "./authenticate"
import { register } from "./register"
import { profile } from "./profile"

export async function userRoutes(app: FastifyInstance) {
    app.post("/users", register)
    app.post("/sessions", authenticate)

    app.get("/profile", { onRequest: [verifyJWT] }, profile)
}