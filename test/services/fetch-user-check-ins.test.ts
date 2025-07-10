import { expect, test, describe, beforeEach } from "vitest"

import { TestCheckInRepository } from "../test-check-in-repository"
import { FetchUserCheckInsService } from "@/services/fetch-user-check-ins"

let checkInRepository: TestCheckInRepository
let fetchUserCheckInsService: FetchUserCheckInsService

describe("Fetch User Check In",
    () => {
        beforeEach(
            () => {
                checkInRepository = new TestCheckInRepository()
                fetchUserCheckInsService = new FetchUserCheckInsService(checkInRepository)
            }
        )

        test("user should have check ins",
            async () => {
                await checkInRepository.create({
                    user_id: "user1",
                    gym_id: "gym1",
                })

                let { checkIns } = await fetchUserCheckInsService.execute({ userId: "user1", page: 1 })

                expect(checkIns).toHaveLength(1)

                await checkInRepository.create({
                    user_id: "user1",
                    gym_id: "gym2",
                })

                checkIns = (await fetchUserCheckInsService.execute({ userId: "user1", page: 1 })).checkIns

                expect(checkIns).toHaveLength(2)
            }
        )

        test("should be able to use pagination",
            async () => {
                for (let i = 1; i <= 24; i++) {
                    await checkInRepository.create({
                        user_id: "user1",
                        gym_id: "gym1",
                    })
                }

                const { checkIns } = await fetchUserCheckInsService.execute({ userId: "user1", page: 2 })

                expect(checkIns).toHaveLength(4)
            }
        )
    }
)