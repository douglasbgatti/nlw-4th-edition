import request from "supertest";
import { getCustomRepository } from "typeorm";
import { app } from "../../src/app";
import createConnection from "../../src/database";
import { UsersRepository } from "../../src/repositories/UsersRepository";


describe("Users route test", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const usersRepository = getCustomRepository(UsersRepository);

    const users = await usersRepository.find();

    await Promise.all(users.map(async (u) => usersRepository.remove(u)));
  });

  it("should create a new test user", async () => {
    const response = await request(app).post("/users").send({
      name: "User example test",
      email: "user@example.com",
    });

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to create a user with same email address", async () => {
    const response = await request(app).post("/users").send({
      name: "User example test",
      email: "user@example.com",
    });

    expect(response.status).toEqual(400);
  });
});
