import { CheckIn } from "@prisma/client"

import { CheckInRepository } from "@/repositories/check-in-repository"


interface FetchUserCheckInsRequest {
    userId: string
    page: number
}

interface FetchUserCheckInsResponse {
    checkIns: CheckIn[]
}

export class FetchUserCheckInsService {
    constructor(
        private checkInRepository: CheckInRepository
    ) { }

    async execute({ userId, page }: FetchUserCheckInsRequest): Promise<FetchUserCheckInsResponse> {
        const checkIns = await this.checkInRepository.findAllByUserId(userId, page)

        return {
            checkIns
        }
    }
}