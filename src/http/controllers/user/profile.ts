import { makeGetUserProfileService } from "@/services/factories/make-get-user-profile-service"
import { FastifyReply, FastifyRequest } from "fastify"

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    const getProfile = makeGetUserProfileService()
    const { user } = await getProfile.execute({
        userId: request.user.sub
    })

    return reply.status(200).send(
        {
            user:
            {
                ...user,
                password_hash: undefined
            }
        }
    )
}