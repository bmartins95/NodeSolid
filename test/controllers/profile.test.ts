import request from "supertest"
import { afterAll, beforeAll, describe, expect, test } from "vitest"

import { app } from "@/app"
import { createAndAuthenticateUser } from "test/create-and-authenticate-user-utils"

describe("Profile (e2e)",
    () => {
        beforeAll(async () => {
            await app.ready()
        })

        afterAll(async () => {
            await app.close()
        })

        test("it should be able to get user profile",
            async () => {
                const { token } = await createAndAuthenticateUser(app)

                const response = await request(app.server)
                    .get("/profile")
                    .set("Authorization", `Bearer ${token}`)
                    .send()

                expect(response.status).toEqual(200)
                expect(response.body.user).toEqual(expect.objectContaining({
                    email: "johndoe@gmail.com"
                }))
            }
        )
    }
)