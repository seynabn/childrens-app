
import sql from "../db";

// Startar en ny lekstund för ett barn.
export async function createPlaySession(childId: number) {
  const sessions = await sql`
    INSERT INTO play_sessions (child_id)
    VALUES (${childId})
    RETURNING
      session_id,
      child_id,
      started_at,
      ended_at,
      engagement,
      created_at
  `;

  return sessions[0];
}


 // Avslutar en pågående lekstund och sparar hur barnet upplevde den.
export async function endPlaySession(
  sessionId: number,
  engagement: "engaged" | "mixed" | "lost_interest",
) {
  const sessions = await sql`
    UPDATE play_sessions
    SET ended_at = NOW(),
        engagement = ${engagement}
    WHERE session_id = ${sessionId}
      AND ended_at IS NULL
    RETURNING
      session_id,
      child_id,
      started_at,
      ended_at,
      engagement,
      created_at
  `;

  return sessions[0];
}

// Hämtar en leksession med dess barn-ID.
export async function getPlaySessionById(sessionId: number) {
  const sessions = await sql`
    SELECT
      session_id,
      child_id,
      started_at,
      ended_at,
      engagement,
      created_at
    FROM play_sessions
    WHERE session_id = ${sessionId}
  `;

  return sessions[0] ?? null;
}