import z from "zod"
import { FastifyReply, FastifyRequest } from "fastify"

import { makeCheckInUserService } from "@/services/factories/make-check-in-user-service"

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid()
    })

    const createCheckInBodySchema = z.object({
        latitude: z.coerce.number().refine(value => Math.abs(value) <= 90),
        longitude: z.coerce.number().refine(value => Math.abs(value) <= 180)
    })

    const { gymId } = createCheckInParamsSchema.parse(request.query)
    const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

    const service = makeCheckInUserService()
    await service.execute({
        gymId,
        userId: request.user.sub,
        userLatitude: latitude,
        userLongitude: longitude
    })

    return reply.status(201).send()
}