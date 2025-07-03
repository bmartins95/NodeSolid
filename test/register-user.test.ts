import { expect, test, describe } from "vitest"
import { compare } from "bcryptjs"

import { UserAlreadyExistsError } from "@/services/errors/user-already-exists"
import { RegisterUserService } from "../src/services/register-user"
import { UserRepository } from "@/repositories/user-repository"
import { Prisma, User } from "@prisma/client"

class TestUserRepository implements UserRepository {
    public users: User[] = []

    async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find(item => item.email === email)

        if (!user) {
            return null
        }

        return user
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const user = {
            id: "user-1",
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            created_at: new Date()
        }
        this.users.push(user)
        return user
    }
}

describe("User Register",
    () => {
        test("user password should be hashed under registration",
            async () => {
                const userRepository = new TestUserRepository()
                const registerUserService = new RegisterUserService(userRepository)

                const password = "123456"
                const { user } = await registerUserService.execute({
                    name: "John Doe",
                    email: "john.doe@example.com",
                    password
                })

                const isPasswordHashed = await compare(password, user.password_hash)
                expect(isPasswordHashed).toBe(true)
            }
        )

        test("only one user by email address",
            async () => {
                const userRepository = new TestUserRepository()
                const registerUserService = new RegisterUserService(userRepository)

                const password = "123456"
                await registerUserService.execute({
                    name: "John Doe",
                    email: "john.doe@example.com",
                    password
                })

                await expect(
                    registerUserService.execute({
                        name: "John Doe",
                        email: "john.doe@example.com",
                        password
                    })
                ).rejects.toThrow(UserAlreadyExistsError)
            }
        )

        test("it should be able to register user",
            async () => {
                const userRepository = new TestUserRepository()
                const registerUserService = new RegisterUserService(userRepository)

                const { user } = await registerUserService.execute({
                    name: "John Doe",
                    email: "john.doe@example.com",
                    password: "123456"
                })

                expect(user.id).toEqual(expect.any(String))
            }
        )
    }
)