import { TestService } from "@domain/services/test-service";
import { TestController, TestRepositoryImpl } from "@infra";
import { CreateTestUseCase } from "@usecases";

export function makeTestController() {
  const testRepository = new TestRepositoryImpl();
  const testService = new TestService(testRepository);
  const createTestUseCase = new CreateTestUseCase(testService);
  return new TestController(createTestUseCase);
}
