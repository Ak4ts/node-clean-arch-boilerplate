import { z } from "zod";

/**
 * Shape of the POST /tests body. Parsing happens at the HTTP boundary so that
 * everything below it -- use case, service, repository -- can trust the type it
 * is handed and never re-check it.
 *
 * Unknown keys are stripped rather than rejected: a client running ahead of
 * this server should not get a 400 for sending a field this version has not
 * learned about yet.
 */
export const createTestSchema = z.object({
  name: z.string().trim().min(1, "name must not be empty").max(255, "name is too long"),
});

export type CreateTestInput = z.infer<typeof createTestSchema>;
