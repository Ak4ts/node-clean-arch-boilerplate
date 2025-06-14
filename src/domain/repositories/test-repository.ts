import { Test } from "@domain/models/test-model";

export interface TestRepository {
  create(user: Test): Promise<Test>;
  getByName(name: string): Promise<Test | null>;
}
