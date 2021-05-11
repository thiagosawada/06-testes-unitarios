import { Connection } from "typeorm";
import getConnection from "../../../../database";
import request from "supertest";
import { app } from "../../../../app"

let connection: Connection;

describe("Get statement operation controller", () => {
  beforeAll(async () => {
    connection = await getConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get statement operation", async () => {
    const user = {
      name: "Andrew Harlan",
      email: "andrew@email.com",
      password: "123456"
    };

    await request(app).post("/api/v1/users").send({
      name: user.name, email: user.email, password: user.password
    });

    const authorizedUser = await request(app).post("/api/v1/sessions").send({
      email: user.email, password: user.password
    });

    const { token } = authorizedUser.body;

    const statement = await request(app).post("/api/v1/statements/deposit").send({
      amount: 100, description: "depósito"
    }).set({
      Authorization: `Bearer ${token}`
    });

    const statement_id = statement.body.id;

    const response = await request(app).get(`/api/v1/statements/${statement_id}`)
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });
});
