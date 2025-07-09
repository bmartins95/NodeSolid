import { CheckIn } from "@prisma/client"
import { CheckInRepository } from "@/repositories/check-in-repository"
import { GymRepository } from "@/repositories/gym-repository"
import { ResourceNotFoundError } from "./errors/resource-not-found"
import { getDistance } from "geolib"
import { UserTooFarFromGymError } from "./errors/user-too-far-from-gym"
import { UserAlreadyCheckedInTodayError } from "./errors/user-already-checked-in-today"

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

    async execute({ userId, gymId, userLatitude, userLongitude }: CheckinUserRequest): Promise<CheckinUserResponse> {
        const gym = await this.gymRepository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundError()
        }

        const userDistanceToGym = getDistance(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
        )

        const MAX_DISTANCE_TO_GYM_IN_METERS = 100
        if (userDistanceToGym > MAX_DISTANCE_TO_GYM_IN_METERS) {
            throw new UserTooFarFromGymError()
        }

        const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate(
            userId,
            new Date(),
        )

        if (checkInOnSameDay) {
            throw new UserAlreadyCheckedInTodayError()
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