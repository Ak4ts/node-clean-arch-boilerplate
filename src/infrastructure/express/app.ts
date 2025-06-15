import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { errorHandler } from "@infra/express/middlewares/error-handler";
import { makeTestController, makeUserController } from "@main";

dotenv.config();

export function createApp() {
  const app = express();

  const testController = makeTestController();
  const userController = makeUserController();

  app.use(bodyParser.json());

  app.post("/tests", testController.createTest.bind(testController));
  app.get("/tests/:id", testController.getTestById.bind(testController));
  app.post("/users", userController.createUser.bind(userController));
  app.post("/users/login", userController.login.bind(userController));

  app.use(errorHandler);

  return app;
}
