import { expect, test, describe, beforeEach } from "vitest"
import { hash } from "bcryptjs"

import { TestUserRepository } from "../test-user-repository"
import { GetUserProfileService } from "@/services/get-user-profile"

let userRepository: TestUserRepository
let getUserProfileService: GetUserProfileService

describe("Authenticate User",
    () => {
        beforeEach(
            () => {
                userRepository = new TestUserRepository()
                getUserProfileService = new GetUserProfileService(userRepository)
            }
        )

        test("it should be able to find user profile",
            async () => {
                const userCreated = await userRepository.create({
                    name: "John Doe",
                    email: "john.doe@example.com",
                    password_hash: await hash("123456", 6)
                })

                const { user } = await getUserProfileService.execute({
                    userId: userCreated.id
                })

                expect(user.id).toEqual(expect.any(String))
            }
        )
    }
)