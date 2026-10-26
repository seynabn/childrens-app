import * as repository from "../repository";

// Skickar ett talförsök vidare till databasen.
export async function createSpeechAttempt(
  childId: number,
  wordId: number,
  sessionId: number,
  attemptedText: string | null,
  recognitionStatus: "unprocessed" | "matched" | "uncertain" | "not_matched",
) {
  return await repository.createSpeechAttempt(
    childId,
    wordId,
    sessionId,
    attemptedText,
    recognitionStatus,
  );
}

export async function getSpeechAttemptsBySession(sessionId: number) {
  return await repository.getSpeechAttemptsBySession(sessionId);
}
