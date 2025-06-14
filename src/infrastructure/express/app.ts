import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { TestRepositoryImpl } from "@infra";
import { TestService } from "@domain/services/test-service";
import { CreateTestUseCase } from "@usecases";
import { TestController } from "@infra";

export function createApp() {
  dotenv.config();
  const app = express();

  const testRepository = new TestRepositoryImpl();
  const testService = new TestService(testRepository);
  const createTestUseCase = new CreateTestUseCase(testService);
  const testController = new TestController(createTestUseCase);

  app.use(bodyParser.json());

  app.post("/tests", testController.createTest.bind(testController));
  app.get("/tests/:id", testController.getTestById.bind(testController));

  return app;
}
