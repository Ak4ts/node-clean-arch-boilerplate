import { Op } from "sequelize";
import { Test } from "@domain";
import { TestRepository } from "@domain";
import { TestModel } from "@infra";

export class TestRepositoryImpl implements TestRepository {
  async create(test: Test): Promise<Test> {
    const testModel = await TestModel.create(test as any);
    return {
      id: testModel.id,
      name: testModel.name,
    };
  }

  async getByName(name: string): Promise<Test | null> {
    const testModel = await TestModel.findOne({
      where: {
        name: {
          [Op.eq]: name,
        },
      },
    });
    if (!testModel) {
      return null;
    }
    return {
      id: testModel.id,
      name: testModel.name,
    };
  }
}
