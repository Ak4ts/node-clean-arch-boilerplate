import { Test, TestRepository } from "@domain";
import { TestModel } from "@infra";
import { Op } from "sequelize";

export class TestRepositoryImpl implements TestRepository {
  async create(test: Test): Promise<Test> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
