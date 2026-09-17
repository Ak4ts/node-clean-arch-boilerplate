import { TestRepositoryImpl } from "@infra";
import { TestService } from "@domain/services/test-service";
import { CreateTestUseCase, GetTestByIdUseCase } from "@usecases";
import { TestController } from "@infra";

export function makeTestController() {
  const testRepository = new TestRepositoryImpl();
  const testService = new TestService(testRepository);
  return new TestController(
    new CreateTestUseCase(testService),
    new GetTestByIdUseCase(testService),
  );
}
