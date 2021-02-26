import request from "supertest";
import { getCustomRepository } from "typeorm";
import { app } from "../../src/app";
import createConnection from "../../src/database";
import { SurveysRepository } from "../../src/repositories/SurveysRepository";


describe("Surveys route test", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const surveys = await surveysRepository.find();

    await Promise.all(surveys.map(async (s) => surveysRepository.remove(s)));
  });

  it("should create a new survey user", async () => {
    const response = await request(app).post("/surveys").send({
      title: "Title example",
      description: "title description",
    });

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should be able to get all surveys", async () => {
    await request(app).post("/surveys").send({
      title: "Title example 2",
      description: "title description",
    });

    const response = await request(app).get("/surveys");

    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(2);
  });
});
