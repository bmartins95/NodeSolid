import { expect, test, describe, beforeEach } from "vitest"

import { TestCheckInRepository } from "./test-check-in-repository"
import { CheckInUserService } from "@/services/check-in-user"

let checkInRepository: TestCheckInRepository
let checkInUserService: CheckInUserService

describe("Check In User",
    () => {
        beforeEach(
            () => {
                checkInRepository = new TestCheckInRepository()
                checkInUserService = new CheckInUserService(checkInRepository)
            }
        )

        test("it should be able to check in user",
            async () => {
                const { checkIn } = await checkInUserService.execute({
                    userId: "user1",
                    gymId: "gym",
                })

                expect(checkIn.id).toEqual(expect.any(String))
            }
        )
    }
)