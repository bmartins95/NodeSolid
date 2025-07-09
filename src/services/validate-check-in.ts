import { CheckIn } from "@prisma/client"
import { CheckInRepository } from "@/repositories/check-in-repository"
import { ResourceNotFoundError } from "./errors/resource-not-found"

interface ValidateCheckInRequest {
    checkInId: string
}

interface ValidateCheckInResponse {
    checkIn: CheckIn
}

export class ValidateCheckInService {
    constructor(private checkInRepository: CheckInRepository) { }

    async execute({ checkInId }: ValidateCheckInRequest): Promise<ValidateCheckInResponse> {
        const checkIn = await this.checkInRepository.findById(checkInId)

        if (!checkIn) {
            throw new ResourceNotFoundError()
        }

        checkIn.validated_at = new Date()
        await this.checkInRepository.save(checkIn)

        return {
            checkIn
        }
    }
}