import { beforeEach, describe, expect, test } from "vitest"
import { TestGymRepository } from "../test-gym-repository"
import { FetchNearbyGymsService } from "@/services/fetch-nearby-gyms"

let gymRepository: TestGymRepository
let fetchNearbyGymsService: FetchNearbyGymsService

describe("Fetch Nearby Gyms",
    () => {
        beforeEach(
            () => {
                gymRepository = new TestGymRepository()
                fetchNearbyGymsService = new FetchNearbyGymsService(gymRepository)
            }
        )

        test("should only return gyms 100 meters or closer to user",
            async () => {
                gymRepository.create({
                    title: "Test gym 1",
                    latitude: 0,
                    longitude: 0
                })

                gymRepository.create({
                    title: "Test gym 2",
                    latitude: 1,
                    longitude: 1
                })

                const { gyms } = await fetchNearbyGymsService.execute({
                    userLatitude: 0,
                    userLongitude: 0
                })

                expect(gyms).toHaveLength(1)
            }
        )
    }
)