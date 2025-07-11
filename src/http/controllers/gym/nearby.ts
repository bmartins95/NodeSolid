import z from "zod"
import { FastifyReply, FastifyRequest } from "fastify"

import { makeFetchNearbyGymsService } from "@/services/factories/make-fetch-nearby-gyms-service"

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
    const fetchNearbyGymsQuerySchema = z.object({
        latitude: z.number().refine(value => Math.abs(value) <= 90),
        longitude: z.number().refine(value => Math.abs(value) <= 180)
    })
    const { latitude, longitude } = fetchNearbyGymsQuerySchema.parse(request.body)

    const service = makeFetchNearbyGymsService()
    const { gyms } = await service.execute({
        userLatitude: latitude,
        userLongitude: longitude
    })

    return reply.status(201).send({
        gyms
    })
}