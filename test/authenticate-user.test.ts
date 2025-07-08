import { expect, test, describe } from "vitest"
import { hash } from "bcryptjs"

import { TestUserRepository } from "./test-user-repository"
import { AuthenticateUserService } from "@/services/authenticate-user"
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials"

describe("Authenticate User",
    () => {
        test("it should be able to authenticate",
            async () => {
                const userRepository = new TestUserRepository()
                const authenticateUserService = new AuthenticateUserService(userRepository)

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
                const userRepository = new TestUserRepository()
                const authenticateUserService = new AuthenticateUserService(userRepository)

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
                const userRepository = new TestUserRepository()
                const authenticateUserService = new AuthenticateUserService(userRepository)

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