import { PrismaCheckInRepository } from "@/repositories/prisma-check-in-repository"
import { FetchUserCheckInsService } from "../fetch-user-check-ins"

export function makeFetchUserCheckInsService(): FetchUserCheckInsService {
    const checkInRepository = new PrismaCheckInRepository()
    const service = new FetchUserCheckInsService(checkInRepository)
    return service
}