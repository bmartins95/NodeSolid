import { GymRepository } from "@/repositories/gym-repository"
import { Gym } from "@prisma/client"

interface FetchNearbyGymsRequest {
    userLatitude: number
    userLongitude: number
}

interface FetchNearbyGymsResponse {
    gyms: Gym[]
}

export class FetchNearbyGymsService {
    constructor(private gymRepository: GymRepository) { }

    async execute({ userLatitude, userLongitude }: FetchNearbyGymsRequest): Promise<FetchNearbyGymsResponse> {
        const MAXIMUM_DISTANCE_FROM_USER = 100
        const gyms = await this.gymRepository.findAllByMaximumDistance({
            latitude: userLatitude,
            longitude: userLongitude,
            maxDistance: MAXIMUM_DISTANCE_FROM_USER
        })
        return { gyms }
    }
}
