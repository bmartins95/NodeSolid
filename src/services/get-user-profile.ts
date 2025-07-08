import { User } from "@prisma/client"
import { UserRepository } from "@/repositories/user-repository"
import { ResourceNotFoundError } from "./errors/resource-not-found"

interface GetUserProfileRequest {
    userId: string
}

interface GetUserProfileResponse {
    user: User
}

export class GetUserProfileService {
    constructor(private userRepository: UserRepository) { }

    async execute({ userId }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
        const user = await this.userRepository.findById(userId)

        if (!user) {
            throw new ResourceNotFoundError()
        }

        return {
            user
        }
    }
}