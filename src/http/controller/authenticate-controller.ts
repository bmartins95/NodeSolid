import z from "zod"
import { FastifyReply, FastifyRequest } from "fastify"

import { PrismaUserRepository } from "@/repositories/prisma-user-repository"
import { AuthenticateUserService } from "@/services/authenticate-user"
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials"

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })
    const { email, password } = authenticateSchema.parse(request.body)

    try {
        const repository = new PrismaUserRepository()
        const service = new AuthenticateUserService(repository)
        await service.execute({
            email,
            password
        })
    }
    catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: error.message })
        }
        throw error
    }

    return reply.status(200).send()
}