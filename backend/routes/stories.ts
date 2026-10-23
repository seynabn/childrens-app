
import type { FastifyPluginAsync } from "fastify";
import type { Database } from "../src/db/client";

const storiesRoutes: FastifyPluginAsync<{ database: Database }> = async (app, { database }) => {
  // GET: Hämta alla berättelser
  app.get("/", async () => {
    const stories = await database.query`
      SELECT id, title, body, created_at
      FROM stories
      ORDER BY created_at DESC
    `;

    return { stories };
  });

  // GET: Hämta en berättelse med dess ID
  app.get<{ Params: { id: string } }>(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", pattern: "^[1-9][0-9]*$" },
          },
        },
      },
    },
    async (request, reply) => {
      const stories = await database.query`
        SELECT id, title, body, created_at
        FROM stories
        WHERE id = ${request.params.id}
        LIMIT 1
      `;

      if (stories.length === 0) {
        return reply.code(404).send({
          error: "STORY_NOT_FOUND",
          message: "Berättelsen hittades inte.",
        });
      }

      return { story: stories[0] };
    },
  );

  // POST: Spara en ny berättelse
  app.post<{ Body: { title: string; body: string } }>(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["title", "body"],
          additionalProperties: false,
          properties: {
            title: { type: "string", minLength: 1, maxLength: 200 },
            body: { type: "string", minLength: 1, maxLength: 10000 },
          },
        },
      },
    },
    async (request, reply) => {
      const title = request.body.title.trim();
      const body = request.body.body.trim();

      if (!title || !body) {
        return reply.code(400).send({
          error: "INVALID_STORY",
          message: "Titel och berättelse får inte vara tomma.",
        });
      }

      const stories = await database.query`
        INSERT INTO stories (title, body)
        VALUES (${title}, ${body})
        RETURNING id, title, body, created_at
      `;

      return reply.code(201).send({ story: stories[0] });
    },
  );
};

export default storiesRoutes;
