import { User } from "@domain";
import { UserRepository } from "@domain/repositories/user-repository";
import { BadRequestError } from "@infra/express/middlewares/error-handler";

export default class UserService {
  constructor(private readonly repository: UserRepository) {}

  async createUser(user: User): Promise<User> {
    const existingUser = await this.repository.getByEmail(user.email);
    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }
    return this.repository.create(user);
  }
}
