import { Op } from "sequelize";
import { User } from "@domain";
import { UserModel } from "@infra";
import { UserRepository } from "@domain/repositories/user-repository";

export class UserRepositoryImpl implements UserRepository {
  async create(user: User): Promise<User> {
    const createdUser = await UserModel.create(user);
    const userPlain = createdUser.get({ plain: true }) as User;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (userPlain as any).password;
    return userPlain;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
      attributes: { include: ["password"] },
    });
    if (!user) {
      return null;
    }
    return user.get({ plain: true }) as User;
  }
}
