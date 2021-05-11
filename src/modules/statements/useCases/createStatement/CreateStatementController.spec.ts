import { Connection } from "typeorm";
import getConnection from "../../../../database";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;
let userToken: string;

describe("Create statement controller", () => {
  beforeAll(async () => {
    connection = await getConnection();
    await connection.runMigrations();
    const user = {
      name: "Omar",
      email: "omar@email.com",
      password: "123456"
    };

    await request(app).post("/api/v1/users").send({
      name: user.name, email: user.email, password: user.password
    })

    const authenticatedUser = await request(app).post("/api/v1/sessions").send({
      email: user.email, password: user.password
    });

    userToken = authenticatedUser.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to make a deposit", async () => {
    const response = await request(app).post("/api/v1/statements/deposit").send({
      amount: 100,
      description: "depósito"
    }).set({
      Authorization: `Bearer ${userToken}`
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should be able to make a withdraw", async () => {
    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 100,
      description: "saque"
    }).set({
      Authorization: `Bearer ${userToken}`
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to make a withdraw if there are not sufficient funds", async () => {
    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 100,
      description: "saque"
    }).set({
      Authorization: `Bearer ${userToken}`
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
})
