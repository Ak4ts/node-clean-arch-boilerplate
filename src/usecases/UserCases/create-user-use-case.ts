import { User } from "@domain";
import { UserService } from "@domain";

export class CreateUserUseCase {
  constructor(private readonly service: UserService) {}

  async execute(input: User): Promise<User> {
    const user: User = {
      id: 0,
      name: input.name,
      email: input.email,
      password: input.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createdUser = await this.service.createUser(user);
    return createdUser;
  }
}
