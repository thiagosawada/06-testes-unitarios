import { Connection } from "typeorm"
import getConnection from "../../../../database";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Show user profile controller", () => {
  beforeAll(async () => {
    connection = await getConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    connection.dropDatabase();
    connection.close();
  })

  it("should be able to show profile", async () => {
    const user = {
      name: "Joe Chip",
      email: "joe@email.com",
      password: "123456"
    };

    await request(app).post("/api/v1/users").send({
      name: user.name, email: user.email, password: user.password
    })

    const authenticatedUser = await request(app).post("/api/v1/sessions").send({
      email: user.email, password: user.password
    });

    const { token } = authenticatedUser.body;

    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name");
  });
})
