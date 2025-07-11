import request from "supertest"
import { afterAll, beforeAll, describe, expect, test } from "vitest"

import { app } from "@/app"

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
                await request(app.server)
                    .post("/users")
                    .send({
                        name: "John Doe",
                        email: "johndoe@gmail.com",
                        password: "123456",
                    })

                const authResponse = await request(app.server)
                    .post("/sessions")
                    .send({
                        email: "johndoe@gmail.com",
                        password: "123456",
                    })

                const response = await request(app.server)
                    .get("/profile")
                    .set("Authorization", `Bearer ${authResponse.body.token}`)
                    .send()

                expect(response.status).toEqual(200)
                expect(response.body.user).toEqual(expect.objectContaining({
                    email: "johndoe@gmail.com"
                }))
            }
        )
    }
)