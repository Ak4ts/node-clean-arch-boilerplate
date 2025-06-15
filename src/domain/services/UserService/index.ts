import { User } from "@domain";
import { UserRepository } from "@domain/repositories/user-repository";
import { BadRequestError, UnauthorizedError } from "@infra/express/middlewares/error-handler";
import bcrypt from "bcrypt";

export default class UserService {
  constructor(private readonly repository: UserRepository) {}

  async createUser(user: User): Promise<User> {
    const existingUser = await this.repository.getByEmail(user.email);
    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }
    return this.repository.create(user);
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.repository.getByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Usuário ou senha inválidos");
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError("Usuário ou senha inválidos");
    }
    return user;
  }
}
