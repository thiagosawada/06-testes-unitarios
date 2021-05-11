import { Connection } from "typeorm";
import getConnection from "../../../../database";
import request from "supertest";
import { app } from "../../../../app"

let connection: Connection;

describe("Get balance controller", () => {
  beforeAll(async () => {
    connection = await getConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get balance", async () => {
    const user = {
      name: "Holden Caufield",
      email: "holden@email.com",
      password: "123456"
    }

    await request(app).post("/api/v1/users").send({
      name: user.name, email: user.email, password: user.password
    });

    const authenticatedUser = await request(app).post("/api/v1/sessions").send({
      email: user.email, password: user.password
    })

    const { token } = authenticatedUser.body;

    const response = await request(app).get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
  });
});
