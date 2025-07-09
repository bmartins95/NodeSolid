import { CheckInRepository } from "@/repositories/check-in-repository"
import { CheckIn, Prisma } from "@prisma/client"
import { randomUUID } from "crypto"

export class TestCheckInRepository implements CheckInRepository {
    public checkIns: CheckIn[] = []

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
}