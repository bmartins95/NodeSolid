import { PrismaGymRepository } from "@/repositories/prisma-gym-repository"
import { FetchNearbyGymsService } from "../fetch-nearby-gyms"

export function makeFetchNearbyGymsService(): FetchNearbyGymsService {
    const gymRepository = new PrismaGymRepository()
    const service = new FetchNearbyGymsService(gymRepository)
    return service
}