import { Test } from "@domain/models/test-model";

export interface TestRepository {
  create(test: NewTest): Promise<Test>;
  getById(id: number): Promise<Test | null>;
  getByName(name: string): Promise<Test | null>;
}

/** A test that has not been persisted yet, and so has no id. */
export type NewTest = Omit<Test, "id" | "createdAt" | "updatedAt">;
