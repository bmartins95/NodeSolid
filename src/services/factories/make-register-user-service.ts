import { PrismaUserRepository } from "@/repositories/prisma-user-repository"
import { RegisterUserService } from "../register-user"

export function makeRegisterUserService(): RegisterUserService {
    const repository = new PrismaUserRepository()
    const service = new RegisterUserService(repository)
    return service
}