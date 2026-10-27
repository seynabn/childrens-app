
import sql from "../db";

// Sparar ett talförsök från barnet.
export async function createSpeechAttempt(
  childId: number,
  wordId: number,
  sessionId: number,
  attemptedText: string | null,
  recognitionStatus: "unprocessed" | "matched" | "uncertain" | "not_matched",
) {
  const attempts = await sql`
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
  return attempts[0];
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
