import UserService from "@domain/services/UserService";
import { User } from "@domain";

export class LoginUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(email: string, password: string): Promise<User> {
    return this.userService.login(email, password);
  }
}
