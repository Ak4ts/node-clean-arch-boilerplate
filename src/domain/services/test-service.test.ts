import { describe, expect, it, vi } from "vitest";
import { BadRequestError, NotFoundError } from "@domain/errors";
import { Test } from "@domain/models/test-model";
import { NewTest, TestRepository } from "@domain/repositories/test-repository";
import { TestService } from "@domain/services/test-service";

function makeTest(overrides: Partial<Test> = {}): Test {
  return { id: 1, name: "alpha", ...overrides };
}

/**
 * The service is pure domain logic, so it is exercised against a stub rather
 * than the database: these tests say what the rules are, not how sequelize
 * stores them.
 */
function makeRepository(overrides: Partial<TestRepository> = {}): TestRepository {
  return {
    create: vi.fn(async (test: NewTest) => makeTest({ name: test.name })),
    getById: vi.fn(async () => null),
    getByName: vi.fn(async () => null),
    ...overrides,
  };
}

describe("TestService.createTest", () => {
  it("persists a test whose name is still free", async () => {
    const repository = makeRepository();
    const service = new TestService(repository);

    const created = await service.createTest({ name: "alpha" });

    expect(created).toEqual(makeTest({ name: "alpha" }));
    expect(repository.getByName).toHaveBeenCalledWith("alpha");
    expect(repository.create).toHaveBeenCalledWith({ name: "alpha" });
  });

  it("rejects a duplicate name with a BadRequestError", async () => {
    const repository = makeRepository({ getByName: vi.fn(async () => makeTest()) });
    const service = new TestService(repository);

    await expect(service.createTest({ name: "alpha" })).rejects.toBeInstanceOf(BadRequestError);
    await expect(service.createTest({ name: "alpha" })).rejects.toThrow(
      'A test named "alpha" already exists',
    );
  });

  it("does not write when the name is taken", async () => {
    const repository = makeRepository({ getByName: vi.fn(async () => makeTest()) });
    const service = new TestService(repository);

    await expect(service.createTest({ name: "alpha" })).rejects.toThrow(BadRequestError);
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe("TestService.getTestById", () => {
  it("returns the stored test", async () => {
    const stored = makeTest({ id: 7, name: "beta" });
    const service = new TestService(makeRepository({ getById: vi.fn(async () => stored) }));

    await expect(service.getTestById(7)).resolves.toEqual(stored);
  });

  it("raises NotFoundError rather than returning null", async () => {
    const service = new TestService(makeRepository());

    await expect(service.getTestById(404)).rejects.toBeInstanceOf(NotFoundError);
    await expect(service.getTestById(404)).rejects.toThrow("Test with ID 404 not found");
  });

  it("never reaches the write path", async () => {
    const repository = makeRepository();
    const service = new TestService(repository);

    await expect(service.getTestById(1)).rejects.toThrow(NotFoundError);
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe("TestService.getTestByName", () => {
  it("passes null through when nothing matches", async () => {
    const service = new TestService(makeRepository());

    await expect(service.getTestByName("missing")).resolves.toBeNull();
  });
});
