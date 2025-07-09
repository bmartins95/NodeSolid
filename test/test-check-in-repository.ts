import { CheckInRepository } from "@/repositories/check-in-repository"
import { CheckIn, Prisma } from "@prisma/client"
import { randomUUID } from "crypto"

export class TestCheckInRepository implements CheckInRepository {
    public checkIns: CheckIn[] = []

    async findById(checkInId: string): Promise<CheckIn | null> {
        const checkIn = this.checkIns.find((checkIn) => checkIn.id == checkInId)

        if (!checkIn) {
            return null
        }

        return checkIn
    }

    async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
        const checkInByUserOnSameDate = this.checkIns.find(
            (checkIn) => {
                const sameDay = new Date(checkIn.created_at).toDateString() === date.toDateString()
                const sameUser = checkIn.user_id === userId
                return sameDay && sameUser
            }
        )

        if (!checkInByUserOnSameDate) {
            return null
        }

        return checkInByUserOnSameDate
    }

    async findAllByUserId(userId: string, page: number): Promise<CheckIn[]> {
        return this.checkIns
            .filter((checkIn) => checkIn.user_id === userId)
            .slice((page - 1) * 20, page * 20)
    }

    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkIn = {
            id: randomUUID(),
            gym_id: data.gym_id,
            user_id: data.user_id,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            created_at: new Date()
        }
        this.checkIns.push(checkIn)
        return checkIn
    }

    async save(checkIn: CheckIn): Promise<CheckIn> {
        const checkInIndex = this.checkIns.findIndex(checkIn => checkIn.id === checkIn.id)

        if (checkInIndex >= 0) {
            this.checkIns[checkInIndex] = checkIn
        }

        return checkIn
    }
}