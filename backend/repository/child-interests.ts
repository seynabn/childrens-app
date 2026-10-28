import sql from "../db";

export const allowedInterests = [
  "animals",
  "vehicles",
  "music",
  "books_stories",
  "food",
  "water_bathing",
  "nature",
  "other",
] as const;

export type InterestType = (typeof allowedInterests)[number];

export type ChildInterestInput = {
  interest: InterestType;
  otherDescription?: string | null;
};

// Hämtar alla intressen för ett barn.
export async function findChildInterests(childId: string) {
  return await sql`
    SELECT
      interest_id,
      child_id,
      interest,
      other_description,
      created_at
    FROM child_interests
    WHERE child_id = ${childId}
    ORDER BY interest ASC
  `;
}

// Ersätter barnets valda intressen i en och samma transaktion.
export async function saveChildInterests(
  childId: string,
  interests: ChildInterestInput[],
) {
  return await sql.begin(async (transaction) => {
    await transaction`
      DELETE FROM child_interests
      WHERE child_id = ${childId}
    `;

    for (const item of interests) {
      await transaction`
        INSERT INTO child_interests (
          child_id,
          interest,
          other_description
        )
        VALUES (
          ${childId},
          ${item.interest},
          ${item.interest === "other"
            ? item.otherDescription ?? null
            : null}
        )
      `;
    }

    return await transaction`
      SELECT
        interest_id,
        child_id,
        interest,
        other_description,
        created_at
      FROM child_interests
      WHERE child_id = ${childId}
      ORDER BY interest ASC
    `;
  });
}
