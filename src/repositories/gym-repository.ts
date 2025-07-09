import { Gym, Prisma } from "@prisma/client"

export interface FindAllByMaximumDistanceParams {
    latitude: number
    longitude: number
    maxDistance: number
}

export interface GymRepository {
    create(data: Prisma.GymCreateInput): Promise<Gym>
    findById(id: string): Promise<Gym | null>
    findAllByMaximumDistance(params: FindAllByMaximumDistanceParams): Promise<Gym[]>
}