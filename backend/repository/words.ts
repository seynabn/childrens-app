
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

// Hämtar alternativa ord för ett visst ord.
export async function getWordChoices(wordId: string) {
  // Kontrollera först att ordet finns.
  const [word] = await sql`
    SELECT word_id
    FROM words
    WHERE word_id = ${wordId}
  `;

  if (!word) {
    return null;
  }

  // Hämta alternativen och information om varje alternativt ord.
  const choices = await sql`
    SELECT
      alternative.word_id,
      alternative.word,
      alternative.image,
      alternative.level
    FROM word_choices AS choice
    JOIN words AS alternative
      ON alternative.word_id = choice.alternative_word_id
    WHERE choice.word_id = ${wordId}
    ORDER BY alternative.word ASC
  `;

  return choices;
}