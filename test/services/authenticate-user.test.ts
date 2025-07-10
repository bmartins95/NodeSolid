import { expect, test, describe, beforeEach } from "vitest"
import { hash } from "bcryptjs"

import { TestUserRepository } from "../test-user-repository"
import { AuthenticateUserService } from "@/services/authenticate-user"
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials"

let userRepository: TestUserRepository
let authenticateUserService: AuthenticateUserService

describe("Authenticate User",
    () => {
        beforeEach(
            () => {
                userRepository = new TestUserRepository()
                authenticateUserService = new AuthenticateUserService(userRepository)
            }
        )

        test("it should be able to authenticate",
            async () => {
                await userRepository.create({
                    name: "John Doe",
                    email: "john.doe@example.com",
                    password_hash: await hash("123456", 6)
                })

                const { user } = await authenticateUserService.execute({
                    email: "john.doe@example.com",
                    password: "123456"
                })

                expect(user.id).toEqual(expect.any(String))
            }
        )

        test("it should not be able to authenticate on invalid email",
            async () => {
                await userRepository.create({
                    name: "John Doe",
                    email: "john.doe@example.com",
                    password_hash: await hash("123456", 6)
                })

                await expect(
                    authenticateUserService.execute({
                        email: "john@example.com",
                        password: "123456"
                    })
                ).rejects.toThrow(InvalidCredentialsError)
            }
        )

        test("it should not be able to authenticate on invalid password",
            async () => {
                await userRepository.create({
                    name: "John Doe",
                    email: "john.doe@example.com",
                    password_hash: await hash("123456", 6)
                })

                await expect(
                    authenticateUserService.execute({
                        email: "john.doe@example.com",
                        password: "12345689"
                    })
                ).rejects.toThrow(InvalidCredentialsError)
            }
        )
    }
)