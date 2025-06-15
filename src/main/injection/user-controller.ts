import { UserRepositoryImpl, UserController } from "@infra";
import { CreateUserUseCase } from "@usecases";
import { UserService } from "@domain";
import { LoginUserUseCase } from "@usecases/UserCases/login-user-use-case";

export function makeUserController() {
  const UserRepository = new UserRepositoryImpl();
  const userService = new UserService(UserRepository);
  const createUserUseCase = new CreateUserUseCase(userService);
  const loginUserUseCase = new LoginUserUseCase(userService);
  return new UserController(createUserUseCase, loginUserUseCase);
}
