import { sequelize } from "@infra";
import { DataTypes, Model } from "sequelize";

export class TestModel extends Model {
  public id!: number;
  public name!: string;
}

TestModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "test",
  },
);
