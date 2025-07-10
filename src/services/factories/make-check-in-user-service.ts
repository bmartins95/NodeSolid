import { CheckInUserService } from "../check-in-user"
import { PrismaCheckInRepository } from "@/repositories/prisma-check-in-repository"
import { PrismaGymRepository } from "@/repositories/prisma-gym-repository"

export function makeCheckInUserService(): CheckInUserService {
    const checkInRepository = new PrismaCheckInRepository()
    const gymRepository = new PrismaGymRepository()
    const service = new CheckInUserService(checkInRepository, gymRepository)
    return service
}