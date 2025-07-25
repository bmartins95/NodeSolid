import { PrismaUserRepository } from "@/repositories/prisma-user-repository"
import { AuthenticateUserService } from "../authenticate-user"

export function makeAuthenticateUserService(): AuthenticateUserService {
    const repository = new PrismaUserRepository()
    const service = new AuthenticateUserService(repository)
    return service
}