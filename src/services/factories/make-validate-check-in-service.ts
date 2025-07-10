import { PrismaCheckInRepository } from "@/repositories/prisma-check-in-repository"
import { ValidateCheckInService } from "../validate-check-in"

export function makeValidateCheckInService(): ValidateCheckInService {
    const checkInRepository = new PrismaCheckInRepository()
    const service = new ValidateCheckInService(checkInRepository)
    return service
}