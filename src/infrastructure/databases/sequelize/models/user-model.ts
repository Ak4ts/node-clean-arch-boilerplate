import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import bcrypt from "bcrypt";

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreationAttributes = Optional<UserAttributes, "id" | "createdAt" | "updatedAt">;

export class UserModel extends Model<UserAttributes, UserCreationAttributes> {}

export function initUserModel(sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
      hooks: {
        beforeCreate: async (user: UserModel) => {
          const password = user.getDataValue("password");
          if (password) {
            user.setDataValue("password", await bcrypt.hash(password, 10));
          }
        },
        beforeUpdate: async (user: UserModel) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((user as any).changed("password")) {
            const password = user.getDataValue("password");
            if (password) {
              user.setDataValue("password", await bcrypt.hash(password, 10));
            }
          }
        },
      },
    },
  );
  return UserModel;
}
