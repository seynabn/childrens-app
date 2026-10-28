
import sql from "../db";

// Sparar ett talförsök bara om lekstunden fortfarande är aktiv.
export async function createSpeechAttempt(
  childId: number,
  wordId: number,
  sessionId: number,
  attemptedText: string | null,
  recognitionStatus: "unprocessed" | "matched" | "uncertain" | "not_matched",
) {
  return await sql.begin(async (tx) => {
    // Lås lekstunden medan vi kontrollerar och sparar talförsöket.
    const sessions = await tx`
      SELECT session_id
      FROM play_sessions
      WHERE session_id = ${sessionId}
        AND child_id = ${childId}
        AND ended_at IS NULL
      FOR UPDATE
    `;

    // Ingen aktiv lekstund hittades: spara inget talförsök.
    if (sessions.length === 0) {
      return null;
    }

    // Lekstunden är aktiv. Nu kan talförsöket sparas.
    const attempts = await tx`
      INSERT INTO speech_attempts (
        child_id,
        word_id,
        session_id,
        attempted_text,
        recognition_status
      )
      VALUES (
        ${childId},
        ${wordId},
        ${sessionId},
        ${attemptedText},
        ${recognitionStatus}
      )
      RETURNING
        attempt_id,
        child_id,
        word_id,
        session_id,
        attempted_text,
        recognition_status,
        created_at
    `;

    return attempts[0] ?? null;
  });
}

export async function getSpeechAttemptsBySession(sessionId: number) {
  const attempts = await sql`
    SELECT
      attempt_id,
      child_id,
      word_id,
      session_id,
      attempted_text,
      recognition_status,
      created_at
    FROM speech_attempts
    WHERE session_id = ${sessionId}
    ORDER BY created_at ASC
  `;

  return attempts;
}
