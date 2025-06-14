import express from 'express';
import bodyParser from 'body-parser';
import { TestRepositoryImpl } from '../databases/sequelize/repositories/test-repository.js';
import { TestService } from '../../domain/services/test-service.js';
import { CreateTestUseCase } from '../../usecases/TestCase/test-use-case.js';
import { TestController } from './controllers/test-controller.js';

export function createApp() {
  const app = express();

  const userRepository = new TestRepositoryImpl();
  const userService = new TestService(userRepository);
  const createUserUseCase = new  CreateTestUseCase(userService);
  const userController = new TestController(createUserUseCase);

  app.use(bodyParser.json());

  app.post('/users', userController.createTest.bind(userController));
  app.get('/users/:id', userController.getTestById.bind(userController));

  return app;
}