import { Test } from '../models/test-model.js';

export interface TestRepository {
  create(user: Test): Promise<Test>;
  getByName(name: string): Promise<Test | null>;
}