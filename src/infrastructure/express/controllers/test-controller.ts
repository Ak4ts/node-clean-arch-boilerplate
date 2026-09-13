import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@domain/errors";
import { CreateTestUseCase, GetTestByIdUseCase } from "@usecases";
import { createTestSchema } from "@infra/express/validators/test-validator";

export class TestController {
  constructor(
    private readonly createTestUseCase: CreateTestUseCase,
    private readonly getTestByIdUseCase: GetTestByIdUseCase,
  ) {}

  async createTest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = createTestSchema.parse(req.body);
      const test = await this.createTestUseCase.execute(input);
      res.status(201).json(test);
    } catch (error) {
      next(error);
    }
  }

  async getTestById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        throw new BadRequestError(`"${req.params.id}" is not a valid test id`);
      }
      const test = await this.getTestByIdUseCase.execute(id);
      res.status(200).json(test);
    } catch (error) {
      next(error);
    }
  }
}
