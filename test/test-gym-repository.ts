import { GymRepository } from "@/repositories/gym-repository"
import { Gym, Prisma } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"
import { randomUUID } from "crypto"

export class TestGymRepository implements GymRepository {
    public gyms: Gym[] = []

    async create(data: Prisma.GymCreateInput): Promise<Gym> {
        const gym = {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Decimal(data.latitude.toString()),
            longitude: new Decimal(data.longitude.toString())
        }
        this.gyms.push(gym)
        return gym
    }

    async findById(id: string): Promise<Gym | null> {
        const user = this.gyms.find(item => item.id === id)

        if (!user) {
            return null
        }

        return user
    }
}