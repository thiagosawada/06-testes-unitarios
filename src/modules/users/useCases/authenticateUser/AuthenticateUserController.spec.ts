import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database"
import { app } from "../../../../app"

let connection: Connection;

describe("Authenticate user controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate a user", async () => {
    const user = {
      name: "Arthur Dent",
      email: "arthur@email.com",
      password: "123456"
    };

    await request(app).post("/api/v1/users").send({
      name: user.name, email: user.email, password: user.password
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email, password: user.password
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toHaveProperty("id");
  });
});
