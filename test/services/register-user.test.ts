import { expect, test, describe, beforeEach } from "vitest"
import { compare } from "bcryptjs"

import { UserAlreadyExistsError } from "@/services/errors/user-already-exists"
import { RegisterUserService } from "@/services/register-user"
import { TestUserRepository } from "../test-user-repository"

let userRepository: TestUserRepository
let registerUserService: RegisterUserService

describe("User Register",
    () => {
        beforeEach(
            () => {
                userRepository = new TestUserRepository()
                registerUserService = new RegisterUserService(userRepository)
            }
        )

        test("user password should be hashed under registration",
            async () => {
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