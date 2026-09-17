import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "@main/express/app";
import { TestModel } from "@infra/databases/sequelize/models/test-model";

/**
 * End-to-end over the real Express app: routing, body parsing, the composed
 * use cases, the ORM on in-memory sqlite and the error middleware. createApp()
 * is a plain factory, so no listener is opened.
 */
const app = createApp();

describe("POST /tests", () => {
  it("creates a test and returns it with its id", async () => {
    const response = await request(app).post("/tests").send({ name: "alpha" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: expect.any(Number), name: "alpha" });
    expect(response.body.id).toBeGreaterThan(0);
  });

  it("persists the row it reports", async () => {
    const response = await request(app).post("/tests").send({ name: "alpha" });

    await expect(TestModel.count()).resolves.toBe(1);
    await expect(TestModel.findByPk(response.body.id)).resolves.not.toBeNull();
  });

  it("refuses a duplicate name with 400", async () => {
    await request(app).post("/tests").send({ name: "alpha" });
    const response = await request(app).post("/tests").send({ name: "alpha" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 400,
      message: 'A test named "alpha" already exists',
    });
    await expect(TestModel.count()).resolves.toBe(1);
  });
});

describe("GET /tests/:id", () => {
  it("returns the stored test", async () => {
    const created = await request(app).post("/tests").send({ name: "beta" });
    const response = await request(app).get(`/tests/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: created.body.id, name: "beta" });
  });

  it("does not create anything -- the regression this route used to be", async () => {
    const response = await request(app).get("/tests/1");

    expect(response.status).toBe(404);
    await expect(TestModel.count()).resolves.toBe(0);
  });

  it("answers 404 for an id that does not exist", async () => {
    const response = await request(app).get("/tests/9999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 404,
      message: "Test with ID 9999 not found",
    });
  });

  it("answers 400 for a non-numeric id instead of failing in the ORM", async () => {
    const response = await request(app).get("/tests/abc");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"abc" is not a valid test id');
  });
});
