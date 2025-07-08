import { CheckIn } from "@prisma/client"
import { CheckInRepository } from "@/repositories/check-in-repository"

interface CheckinUserRequest {
    userId: string
    gymId: string
}

interface CheckinUserResponse {
    checkIn: CheckIn
}

export class CheckInUserService {
    constructor(private checkInRepository: CheckInRepository) { }

    async execute({ userId, gymId }: CheckinUserRequest): Promise<CheckinUserResponse> {
        const checkIn = await this.checkInRepository.create({
            gym_id: gymId,
            user_id: userId
        })

        return {
            checkIn
        }
    }
}