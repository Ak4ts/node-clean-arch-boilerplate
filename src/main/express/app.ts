import { errorHandler } from "@infra/express/middlewares/error-handler";
import { makeTestController } from "@main/composer";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

export function createApp() {
  const app = express();

  const testController = makeTestController();

  app.use(bodyParser.json());

  app.post("/tests", testController.createTest.bind(testController));
  app.get("/tests/:id", testController.getTestById.bind(testController));

  app.use(errorHandler);

  return app;
}
