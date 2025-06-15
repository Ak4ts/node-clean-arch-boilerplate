import { TestRepositoryImpl } from "@infra";
import { TestService } from "@domain/services/test-service";
import { CreateTestUseCase } from "@usecases";
import { TestController } from "@infra";

export function makeTestController() {
  const testRepository = new TestRepositoryImpl();
  const testService = new TestService(testRepository);
  const createTestUseCase = new CreateTestUseCase(testService);
  return new TestController(createTestUseCase);
}
