import { Request, Response } from "express";
import { CreateUserUseCase } from "@usecases";

export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const rawUser = req.body;
      const user = await this.createUserUseCase.execute(rawUser);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "BadRequestError") {
          res.status(400).json({ message: error.message });
          return;
        }
      }
      console.error(error);
      res.status(500).json({ message: "Error creating user" });
    }
  }
}
