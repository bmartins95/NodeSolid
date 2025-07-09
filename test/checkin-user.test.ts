import { expect, test, describe, beforeEach, vi, afterEach } from "vitest"

import { TestCheckInRepository } from "./test-check-in-repository"
import { CheckInUserService } from "@/services/check-in-user"
import { TestGymRepository } from "./test-gym-repository"

let checkInRepository: TestCheckInRepository
let gymRepository: TestGymRepository
let checkInUserService: CheckInUserService

describe("Check In User",
    () => {
        beforeEach(
            () => {
                checkInRepository = new TestCheckInRepository()
                gymRepository = new TestGymRepository()
                checkInUserService = new CheckInUserService(checkInRepository, gymRepository)

                gymRepository.create({
                    id: "gym1",
                    title: "Test gym",
                    latitude: 0,
                    longitude: 0
                })

                vi.useFakeTimers()
            }
        )

        afterEach(
            () => {
                vi.useRealTimers()
            }
        )

        test("it should be able to check in user",
            async () => {
                await gymRepository

                const { checkIn } = await checkInUserService.execute({
                    userId: "user1",
                    gymId: "gym1",
                    userLatitude: 0,
                    userLongitude: 0
                })

                expect(checkIn.id).toEqual(expect.any(String))
            }
        )

        test("it should not be able to check in more than once time per day",
            async () => {
                vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

                await checkInUserService.execute({
                    userId: "user1",
                    gymId: "gym1",
                    userLatitude: 0,
                    userLongitude: 0
                })

                await expect(
                    checkInUserService.execute({
                        userId: "user1",
                        gymId: "gym1",
                        userLatitude: 0,
                        userLongitude: 0
                    })
                ).rejects.toThrow(Error)
            }
        )

        test("it should not be able to check in same user on different days",
            async () => {
                vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

                await checkInUserService.execute({
                    userId: "user1",
                    gymId: "gym1",
                    userLatitude: 0,
                    userLongitude: 0
                })

                vi.setSystemTime(new Date(2025, 0, 21, 8, 0, 0))

                const { checkIn } = await checkInUserService.execute({
                    userId: "user1",
                    gymId: "gym1",
                    userLatitude: 0,
                    userLongitude: 0
                })

                expect(checkIn.id).toEqual(expect.any(String))
            }
        )

        test("it should not be able to check in on distant gym",
            async () => {
                vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

                gymRepository.create({
                    id: "gym2",
                    title: "Test gym 2",
                    latitude: 20,
                    longitude: 20
                })

                await expect(
                    checkInUserService.execute({
                        userId: "user1",
                        gymId: "gym2",
                        userLatitude: 0,
                        userLongitude: 0
                    })
                ).rejects.toThrow(Error)
            }
        )
    }
)