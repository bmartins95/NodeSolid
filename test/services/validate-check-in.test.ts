import { expect, test, describe, beforeEach, afterEach, vi } from "vitest"

import { TestCheckInRepository } from "../test-check-in-repository"
import { ValidateCheckInService } from "@/services/validate-check-in"

let checkInRepository: TestCheckInRepository
let validateCheckInService: ValidateCheckInService

describe("Vaidate Check In",
    () => {
        beforeEach(
            () => {
                checkInRepository = new TestCheckInRepository()
                validateCheckInService = new ValidateCheckInService(checkInRepository)

                vi.useFakeTimers()
            }
        )

        afterEach(
            () => {
                vi.useRealTimers()
            }
        )

        test("it should be able to validate check in",
            async () => {

                vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

                const checkInCreateResponse = await checkInRepository.create({
                    gym_id: "gym1",
                    user_id: "user1"
                })

                expect(checkInCreateResponse.id).toEqual(checkInCreateResponse.id)
                expect(checkInCreateResponse.validated_at).toEqual(null)

                const validationDate = new Date(2025, 0, 20, 9, 0, 0)
                vi.setSystemTime(validationDate)

                const { checkIn } = await validateCheckInService.execute({
                    checkInId: checkInCreateResponse.id
                })

                expect(checkIn.validated_at?.toISOString()).toEqual(validationDate.toISOString())
            }
        )
    }
)