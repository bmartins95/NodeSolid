import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

import { PrismaUserRepository } from "@/repositories/prisma-user-repository"

interface RegisterRequest {
    name: string,
    email: string,
    password: string
}

export async function registerService({ name, email, password }: RegisterRequest) {
    const checkUserWithSameEmail = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (checkUserWithSameEmail) {
        throw new Error("E-mail already exist!")
    }

    const password_hash = await hash(password, 6)
    const userRepository = new PrismaUserRepository()
    userRepository.create({
        name,
        email,
        password_hash
    })
}