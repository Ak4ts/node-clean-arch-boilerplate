import { describe, expect, it } from "vitest";
import { TestRepositoryImpl } from "@infra/databases/sequelize/repositories/test-repository";

/**
 * These run against the real ORM on in-memory sqlite -- no MySQL, no fixtures
 * to clean up. test/setup.ts recreates the schema before each test.
 */
describe("TestRepositoryImpl", () => {
  const repository = new TestRepositoryImpl();

  it("assigns an id on create and returns timestamps", async () => {
    const created = await repository.create({ name: "alpha" });

    expect(created.id).toBeGreaterThan(0);
    expect(created.name).toBe("alpha");
    expect(created.createdAt).toBeInstanceOf(Date);
    expect(created.updatedAt).toBeInstanceOf(Date);
  });

  it("round-trips through getById", async () => {
    const created = await repository.create({ name: "beta" });

    await expect(repository.getById(created.id)).resolves.toMatchObject({
      id: created.id,
      name: "beta",
    });
  });

  it("round-trips through getByName", async () => {
    const created = await repository.create({ name: "gamma" });

    await expect(repository.getByName("gamma")).resolves.toMatchObject({ id: created.id });
  });

  it("returns null rather than throwing for absent rows", async () => {
    await expect(repository.getById(9999)).resolves.toBeNull();
    await expect(repository.getByName("nope")).resolves.toBeNull();
  });

  it("matches names exactly, not by prefix", async () => {
    await repository.create({ name: "alpha" });

    await expect(repository.getByName("alph")).resolves.toBeNull();
    await expect(repository.getByName("alpha ")).resolves.toBeNull();
  });

  it("starts each test from an empty table", async () => {
    await expect(repository.getByName("alpha")).resolves.toBeNull();
  });
});
