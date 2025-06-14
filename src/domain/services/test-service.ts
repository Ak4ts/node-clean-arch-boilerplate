import { Test } from '../models/test-model';
import { TestRepository } from '../repositories/test-repository';

export class TestService {
  constructor(private readonly testRepository: TestRepository) {}

  async createTest(test: Test): Promise<Test> {
    const existingTest = await this.testRepository.getByName(test.name);
    if (existingTest) {
      throw new Error('Test already exists with that email address');
    }
    return this.testRepository.create(test);
  }

  async getTestByName(name: string): Promise<Test | null> {
    return this.testRepository.getByName(name);
  }
}