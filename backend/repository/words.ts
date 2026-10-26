
import sql from "../db";

// Hämtar alla ord från databasen.
export async function getWords() {
  const words = await sql`
    SELECT word_id, word, image, level, created_at
    FROM words
    ORDER BY level ASC, word ASC
  `;

  return words;
}
