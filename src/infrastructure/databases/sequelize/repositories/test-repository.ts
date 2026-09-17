import { Op } from "sequelize";
import { NewTest, Test, TestRepository } from "@domain";
import { TestModel } from "../models/test-model";

function toTest(model: TestModel): Test {
  return {
    id: model.id,
    name: model.name,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  };
}

export class TestRepositoryImpl implements TestRepository {
  async create(test: NewTest): Promise<Test> {
    return toTest(await TestModel.create({ name: test.name }));
  }

  async getById(id: number): Promise<Test | null> {
    const testModel = await TestModel.findByPk(id);
    return testModel ? toTest(testModel) : null;
  }

  async getByName(name: string): Promise<Test | null> {
    const testModel = await TestModel.findOne({
      where: {
        name: {
          [Op.eq]: name,
        },
      },
    });
    return testModel ? toTest(testModel) : null;
  }
}
