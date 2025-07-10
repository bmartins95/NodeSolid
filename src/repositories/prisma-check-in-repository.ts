import dayjs from "dayjs"

import { CheckIn, Prisma } from "@prisma/client"
import { CheckInRepository } from "./check-in-repository"
import { prisma } from "@/lib/prisma"

export class PrismaCheckInRepository implements CheckInRepository {
    async findById(checkInId: string): Promise<CheckIn | null> {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id: checkInId
            }
        })
        return checkIn
    }

    async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
        const startOfDay = dayjs(date).startOf("date")
        const endOfDay = dayjs(date).endOf("date")
        const checkIn = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfDay.toDate(),
                    lte: endOfDay.toDate()
                }
            }
        })
        return checkIn
    }

    async findAllByUserId(userId: string, page: number): Promise<CheckIn[]> {
        const ITEMS_PER_PAGE = 20
        const checkIns = await prisma.checkIn.findMany({
            where: {
                user_id: userId
            },
            take: ITEMS_PER_PAGE,
            skip: (page - 1) * ITEMS_PER_PAGE
        })
        return checkIns
    }

    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkIn = await prisma.checkIn.create({
            data
        })
        return checkIn
    }

    async save(data: CheckIn): Promise<CheckIn> {
        const checkIn = await prisma.checkIn.update({
            where: {
                id: data.id
            },
            data
        })
        return checkIn
    }
}