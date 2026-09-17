import { beforeEach } from "vitest";
import { sequelize } from "@infra/databases/sequelize/connection";
// Importing the model registers it on the connection before sync() runs.
import "@infra/databases/sequelize/models/test-model";

/**
 * Every test starts against an empty schema. sqlite keeps the whole database in
 * memory, so recreating it per test costs microseconds and removes any ordering
 * coupling between tests.
 */
beforeEach(async () => {
  await sequelize.sync({ force: true });
});
