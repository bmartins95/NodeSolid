import { CheckIn, Prisma } from "@prisma/client"

export interface CheckInRepository {
    findById(checkInId: string): Promise<CheckIn | null>
    findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
    findAllByUserId(userId: string, page: number): Promise<CheckIn[]>
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    save(checkIn: CheckIn): Promise<CheckIn>
}