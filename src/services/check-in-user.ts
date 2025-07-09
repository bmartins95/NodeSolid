import { CheckIn } from "@prisma/client"
import { CheckInRepository } from "@/repositories/check-in-repository"
import { GymRepository } from "@/repositories/gym-repository"
import { ResourceNotFoundError } from "./errors/resource-not-found"

interface CheckinUserRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface CheckinUserResponse {
    checkIn: CheckIn
}

export class CheckInUserService {
    constructor(
        private checkInRepository: CheckInRepository,
        private gymRepository: GymRepository
    ) { }

    async execute({ userId, gymId }: CheckinUserRequest): Promise<CheckinUserResponse> {
        const gym = await this.gymRepository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundError()
        }

        const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate(
            userId,
            new Date(),
        )

        if (checkInOnSameDay) {
            throw new Error()
        }

        const checkIn = await this.checkInRepository.create({
            gym_id: gymId,
            user_id: userId
        })

        return {
            checkIn
        }
    }
}