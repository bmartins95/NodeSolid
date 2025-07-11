import z from "zod"
import { FastifyReply, FastifyRequest } from "fastify"

import { makeFetchUserCheckInsService } from "@/services/factories/make-fetch-user-check-ins-service"

export async function history(request: FastifyRequest, reply: FastifyReply) {
    const getUserCheckInHistoryQueryParams = z.object({
        page: z.number().min(1).default(1)
    })

    const { page } = getUserCheckInHistoryQueryParams.parse(request.query)

    const service = makeFetchUserCheckInsService()
    const { checkIns } = await service.execute({
        userId: request.user.sub,
        page
    })

    return reply.status(201).send({
        checkIns
    })
}