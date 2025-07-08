import { compare } from "bcryptjs"

import { User } from "@prisma/client"
import { UserRepository } from "@/repositories/user-repository"
import { InvalidCredentialsError } from "./errors/invalid-credentials"

interface AuthenticateUserRequest {
    email: string
    password: string
}

interface AuthenticateUserResponse {
    user: User
}

export class AuthenticateUserService {
    constructor(private userRepository: UserRepository) { }

    async execute({ email, password }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            throw new InvalidCredentialsError()
        }

        const passwordMatches = await compare(password, user.password_hash)

        if (!passwordMatches) {
            throw new InvalidCredentialsError()
        }

        return {
            user
        }
    }
}