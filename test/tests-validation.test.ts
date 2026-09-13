import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "@main/express/app";
import { TestModel } from "@infra/databases/sequelize/models/test-model";

const app = createApp();

function post(body: unknown) {
  return request(app)
    .post("/tests")
    .send(body as object);
}

describe("POST /tests rejects an invalid body", () => {
  it.each([
    ["a missing name", {}, "name"],
    ["an empty name", { name: "" }, "name"],
    ["a whitespace-only name", { name: "   " }, "name"],
    ["a non-string name", { name: 42 }, "name"],
    ["a name over the length limit", { name: "a".repeat(256) }, "name"],
  ])("with %s", async (_label, body, field) => {
    const response = await post(body);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid request");
    expect(response.body.issues).toContainEqual(
      expect.objectContaining({ field, message: expect.any(String) }),
    );
  });

  it("writes nothing when the body is rejected", async () => {
    await post({});

    await expect(TestModel.count()).resolves.toBe(0);
  });

  it("reports every failing field, not just the first", async () => {
    const response = await post({ name: "" });

    expect(Array.isArray(response.body.issues)).toBe(true);
    expect(response.body.issues.length).toBeGreaterThan(0);
  });
});

describe("POST /tests normalises an acceptable body", () => {
  it("trims surrounding whitespace before storing", async () => {
    const response = await post({ name: "  alpha  " });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("alpha");
    await expect(TestModel.findByPk(response.body.id)).resolves.toMatchObject({ name: "alpha" });
  });

  it("treats a padded duplicate as a duplicate", async () => {
    await post({ name: "alpha" });
    const response = await post({ name: "  alpha  " });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('A test named "alpha" already exists');
    await expect(TestModel.count()).resolves.toBe(1);
  });

  it("ignores unknown keys instead of refusing them", async () => {
    const response = await post({ name: "alpha", admin: true, extra: { nested: 1 } });

    expect(response.status).toBe(201);
    expect(response.body).not.toHaveProperty("admin");
    expect(response.body).not.toHaveProperty("extra");
  });

  it("accepts a name at exactly the length limit", async () => {
    const response = await post({ name: "a".repeat(255) });

    expect(response.status).toBe(201);
  });
});
