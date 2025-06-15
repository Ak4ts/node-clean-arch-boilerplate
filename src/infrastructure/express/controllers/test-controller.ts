import { NotFoundError } from "@infra/express/middlewares/error-handler";
import { Request, Response } from "express";
import { CreateTestUseCase } from "@usecases";

export class TestController {
  constructor(private readonly createTestUseCase: CreateTestUseCase) {}

  async createTest(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const test = await this.createTestUseCase.execute(name);
      res.status(201).json(test);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "BadRequestError") {
          res.status(400).json({ message: error.message });
          return;
        }
      }
      console.error(error);
      res.status(500).json({ message: "Error creating test" });
    }
  }

  async getTestById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const test = await this.createTestUseCase.execute(id);
      if (!test) {
        throw new NotFoundError(`Test with ID ${id} not found`);
      } else {
        res.status(200).json(test);
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "Error getting test" });
    }
  }
}
