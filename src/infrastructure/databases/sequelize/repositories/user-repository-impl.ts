import { Op } from "sequelize";
import { User } from "@domain";
import { UserModel } from "@infra";
import { UserRepository } from "@domain/repositories/user-repository";

export class UserRepositoryImpl implements UserRepository {
  async create(user: User): Promise<User> {
    const createdUser = await UserModel.create(user);
    return createdUser;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }
}
