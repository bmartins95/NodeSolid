import { hash } from "bcryptjs"

import { UserRepository } from "@/repositories/user-repository"
import { UserAlreadyExistsError } from "./errors/user-already-exists"

interface RegisterUserRequest {
    name: string,
    email: string,
    password: string
}

export class RegisterUserService {
    constructor(private userRepository: UserRepository) { }

    async execute({ name, email, password }: RegisterUserRequest) {
        const userWithSameEmail = await this.userRepository.findByEmail(email)
        if (userWithSameEmail) {
            throw new UserAlreadyExistsError()
        }

        const password_hash = await hash(password, 6)
        this.userRepository.create({
            name,
            email,
            password_hash
        })
    }
}

