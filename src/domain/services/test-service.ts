import { BadRequestError, NotFoundError } from "@domain/errors";
import { Test } from "@domain/models/test-model";
import { NewTest, TestRepository } from "@domain/repositories/test-repository";

export class TestService {
  constructor(private readonly testRepository: TestRepository) {}

  async createTest(test: NewTest): Promise<Test> {
    const existingTest = await this.testRepository.getByName(test.name);
    if (existingTest) {
      throw new BadRequestError(`A test named "${test.name}" already exists`);
    }
    return this.testRepository.create(test);
  }

  async getTestById(id: number): Promise<Test> {
    const test = await this.testRepository.getById(id);
    if (!test) {
      throw new NotFoundError(`Test with ID ${id} not found`);
    }
    return test;
  }

  async getTestByName(name: string): Promise<Test | null> {
    return this.testRepository.getByName(name);
  }
}
