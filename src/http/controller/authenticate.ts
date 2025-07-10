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
        const token = await reply.jwtSign({}, { sign: { sub: user.id } })
        return reply.status(200).send({ token })
    }
    catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: error.message })
        }
        throw error
    }

}