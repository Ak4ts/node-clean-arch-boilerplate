import { Test, TestService } from "@domain";

export class GetTestByIdUseCase {
  constructor(private readonly testService: TestService) {}

  /** Resolves the test, or rejects with a NotFoundError when there is none. */
  async execute(id: number): Promise<Test> {
    return this.testService.getTestById(id);
  }
}
