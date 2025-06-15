import { DataTypes, Model, Sequelize } from "sequelize";

export class TestModel extends Model {
  public id!: number;
  public name!: string;
}

export function initTestModel(sequelize: Sequelize): typeof TestModel {
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
  return TestModel;
}
