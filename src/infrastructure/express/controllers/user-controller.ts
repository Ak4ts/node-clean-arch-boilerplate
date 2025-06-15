import { Request, Response } from "express";
import { CreateUserUseCase } from "@usecases";
import { LoginUserUseCase } from "@usecases/UserCases/login-user-use-case";

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

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

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.loginUserUseCase.execute(email, password);
      // Nunca retorne a senha!
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...userSafe } = user;
      res.status(200).json(userSafe);
    } catch (error) {
      if (error instanceof Error && error.name === "UnauthorizedError") {
        res.status(401).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "Error logging in" });
    }
  }
}
