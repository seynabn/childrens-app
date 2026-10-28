import type { FastifyPluginAsync } from "fastify";
import sql from "../db";

const storiesRoutes: FastifyPluginAsync = async (app) => {
  // GET: Hämta alla berättelser med tillhörande ord.
  app.get("/", async () => {
    const stories = await sql`
      SELECT
        s.id,
        s.title,
        s.body,
        s.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'word_id', w.word_id,
              'word', w.word
            )
            ORDER BY w.word
          ) FILTER (WHERE w.word_id IS NOT NULL),
          '[]'::json
        ) AS words
      FROM stories s
      LEFT JOIN story_words sw ON sw.story_id = s.id
      LEFT JOIN words w ON w.word_id = sw.word_id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `;

    return { stories };
  });

  // GET: Hämta en berättelse med dess ID och tillhörande ord.
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
      const stories = await sql`
        SELECT
          s.id,
          s.title,
          s.body,
          s.created_at,
          COALESCE(
            json_agg(
              json_build_object(
                'word_id', w.word_id,
                'word', w.word
              )
              ORDER BY w.word
            ) FILTER (WHERE w.word_id IS NOT NULL),
            '[]'::json
          ) AS words
        FROM stories s
        LEFT JOIN story_words sw ON sw.story_id = s.id
        LEFT JOIN words w ON w.word_id = sw.word_id
        WHERE s.id = ${request.params.id}
        GROUP BY s.id
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

  // POST: Spara en berättelse och koppla dess ord.
  app.post<{
    Body: {
      title: string;
      body: string;
      word_ids: number[];
    };
  }>(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["title", "body", "word_ids"],
          additionalProperties: false,
          properties: {
            title: { type: "string", minLength: 1, maxLength: 200 },
            body: { type: "string", minLength: 1, maxLength: 10000 },
            word_ids: {
              type: "array",
              items: { type: "integer", minimum: 1 },
              uniqueItems: true,
              maxItems: 100,
            },
          },
        },
      },
    },
    async (request, reply) => {
      const title = request.body.title.trim();
      const body = request.body.body.trim();
      const wordIds = request.body.word_ids;

      if (!title || !body) {
        return reply.code(400).send({
          error: "INVALID_STORY",
          message: "Titel och berättelse får inte vara tomma.",
        });
      }

      const result = await sql.begin(async (tx) => {
        // Kontrollera att alla angivna ord finns.
        const words = await tx`
        SELECT word_id
        FROM words
        WHERE word_id IN ${tx(wordIds)}
      `;

        if (words.length !== wordIds.length) {
          return { invalidWords: true as const };
        }

        // Spara berättelsen.
        const [story] = await tx`
        INSERT INTO stories (title, body)
         VALUES (${title}, ${body})
         RETURNING id, title, body, created_at`;

        if (!story) {
          throw new Error("Berättelsen kunde inte sparas.");
        }

        // Koppla berättelsen till dess ord.
        if (wordIds.length > 0) {
          await tx`
          INSERT INTO story_words (story_id, word_id)
          SELECT ${story.id}, word_id
          FROM unnest(${tx.array(wordIds)}::bigint[]) AS word_id
        `;
        }

        // Hämta berättelsen med dess kopplade ord.
        const [storyWithWords] = await tx`
        SELECT
          s.id,
          s.title,
          s.body,
          s.created_at,
          COALESCE(
            json_agg(
              json_build_object(
                'word_id', w.word_id,
                'word', w.word
              )
              ORDER BY w.word
            ) FILTER (WHERE w.word_id IS NOT NULL),
            '[]'::json
          ) AS words
        FROM stories s
        LEFT JOIN story_words sw ON sw.story_id = s.id
        LEFT JOIN words w ON w.word_id = sw.word_id
        WHERE s.id = ${story.id}
        GROUP BY s.id
      `;

        return { story: storyWithWords };
      });

      if ("invalidWords" in result) {
        return reply.code(400).send({
          error: "INVALID_WORD_IDS",
          message: "Ett eller flera angivna ord finns inte.",
        });
      }

      return reply.code(201).send({ story: result.story });
    },
  );
};

export default storiesRoutes;
