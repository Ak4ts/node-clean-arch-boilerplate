import { UserRepositoryImpl, UserController } from "@infra";
import { CreateUserUseCase } from "@usecases";
import { UserService } from "@domain";

export function makeUserController() {
  const UserRepository = new UserRepositoryImpl();
  const userService = new UserService(UserRepository);
  const createUserUseCase = new CreateUserUseCase(userService);
  return new UserController(createUserUseCase);
}
