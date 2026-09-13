import { NewTest, Test, TestService } from "@domain";

export class CreateTestUseCase {
  constructor(private readonly testService: TestService) {}

  async execute(input: NewTest): Promise<Test> {
    return this.testService.createTest(input);
  }
}
