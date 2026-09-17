import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export class TestModel extends Model {
  // `declare` and not `public id!: number`: under target ES2022 TypeScript
  // emits class fields as real own properties, which shadow the attribute
  // getters Sequelize installs on the prototype and read back as undefined.
  declare id: number;
  declare name: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
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
