import z from "zod"
import { FastifyReply, FastifyRequest } from "fastify"

import { InvalidCredentialsError } from "@/services/errors/invalid-credentials"
import { makeAuthenticateUserService } from "@/services/factories/make-authenticate-user-service"

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })
    const { email, password } = authenticateSchema.parse(request.body)

    try {
        const service = makeAuthenticateUserService()
        const { user } = await service.execute({
            email,
            password
        })

        const token = await reply.jwtSign({ id: user.id }, { sign: { sub: user.id } })
        const refreshToken = await reply.jwtSign({ id: user.id }, { sign: { sub: user.id, expiresIn: "7d" } })

        return reply
            .setCookie("refreshToken", refreshToken, {
                path: "/",
                secure: true,
                sameSite: true,
                httpOnly: true
            })
            .status(200)
            .send({ token })
    }
    catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: error.message })
        }
        throw error
    }

}