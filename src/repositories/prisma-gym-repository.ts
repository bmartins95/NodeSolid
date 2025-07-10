import { FindAllByMaximumDistanceParams, GymRepository } from "./gym-repository"
import { Prisma, Gym } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export class PrismaGymRepository implements GymRepository {
    async findById(id: string): Promise<Gym | null> {
        const gym = await prisma.gym.findUnique({
            where: {
                id
            }
        })
        return gym
    }

    async findAllByMaximumDistance({ latitude, longitude, maxDistance }: FindAllByMaximumDistanceParams): Promise<Gym[]> {
        const EARTH_RADIUS = 6371000

        const gyms = await prisma.$queryRawUnsafe<Gym[]>(`
            SELECT 
            *, 
            (
                ${EARTH_RADIUS} * acos(
                cos(radians(${latitude})) 
                * cos(radians(latitude)) 
                * cos(radians(longitude) - radians(${longitude})) 
                + sin(radians(${latitude})) 
                * sin(radians(latitude))
                )
            ) AS distance
            FROM gyms
            HAVING distance <= ${maxDistance}
            ORDER BY distance ASC
        `)

        return gyms
    }

    async create(data: Prisma.GymCreateInput): Promise<Gym> {
        const gym = await prisma.gym.create({
            data
        })
        return gym
    }
}