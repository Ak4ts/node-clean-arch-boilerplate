import { Test } from "@domain";
import { TestService } from "@domain";

export class CreateTestUseCase {
  constructor(private readonly testService: TestService) {}

  async execute(input: string): Promise<Test> {
    const test: Test = {
      id: 0,
      name: input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createdTest = await this.testService.createTest(test);
    return createdTest;
  }
}
