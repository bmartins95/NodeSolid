import { PrismaUserRepository } from "@/repositories/prisma-user-repository"
import { GetUserProfileService } from "../get-user-profile"

export function makeGetUserProfileService(): GetUserProfileService {
    const userRepository = new PrismaUserRepository()
    const service = new GetUserProfileService(userRepository)
    return service
}