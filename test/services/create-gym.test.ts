import { beforeEach, describe, expect, test } from "vitest"
import { TestGymRepository } from "../test-gym-repository"
import { CreateGymService } from "@/services/create-gym"

let gymRepository: TestGymRepository
let createGymService: CreateGymService

describe("User Register",
    () => {
        beforeEach(
            () => {
                gymRepository = new TestGymRepository()
                createGymService = new CreateGymService(gymRepository)
            }
        )

        test("user password should be hashed under registration",
            async () => {
                const { gym } = await createGymService.execute({
                    title: "Test gym",
                    latitude: 0,
                    longitude: 0
                })

                expect(gym.id).toEqual(expect.any(String))
            }
        )
    }
)