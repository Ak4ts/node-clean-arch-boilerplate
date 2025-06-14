import { Op } from 'sequelize';
import { Test } from '../../../../domain/models/test-model.js';
import { TestRepository } from '../../../../domain/repositories/test-repository.js';
import { TestModel } from '../models/test-model.js';

export class TestRepositoryImpl implements TestRepository {
  async create(test: Test): Promise<Test> {
    const testModel = await TestModel.create(test as any);
    return {
      id: testModel.id,
      name: testModel.name,
    };
  }

  async getByName(email: string): Promise<Test | null> {
    const testModel = await TestModel.findOne({
      where: {
        email: {
          [Op.eq]: email,
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