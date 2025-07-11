import z from "zod"
import { FastifyReply, FastifyRequest } from "fastify"

import { UserAlreadyExistsError } from "@/services/errors/user-already-exists"
import { makeRegisterUserService } from "@/services/factories/make-register-user-service"

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const newUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })
    const { name, email, password } = newUserSchema.parse(request.body)

    try {
        const service = makeRegisterUserService()
        await service.execute({
            name,
            email,
            password
        })
    }
    catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: error.message })
        }
        throw error
    }

    return reply.status(201).send()
}