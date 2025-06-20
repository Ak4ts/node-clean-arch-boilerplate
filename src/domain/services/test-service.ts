import { BadRequestError } from "@infra/express/middlewares/error-handler";
import { Test } from "@domain/models/test-model";
import { TestRepository } from "@domain/repositories/test-repository";

export class TestService {
  constructor(private readonly testRepository: TestRepository) {}

  async createTest(test: Test): Promise<Test> {
    const existingTest = await this.testRepository.getByName(test.name);
    if (existingTest) {
      throw new BadRequestError("Test already exists with that email address");
    }
    return this.testRepository.create(test);
  }

  async getTestByName(name: string): Promise<Test | null> {
    return this.testRepository.getByName(name);
  }
}
