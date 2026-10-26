
import * as repository from "../repository";

// Startar en ny lekstund.
export async function createPlaySession(childId: number) {
  return await repository.createPlaySession(childId);
}


export async function endPlaySession(
  sessionId: number,
  engagement: "engaged" | "mixed" | "lost_interest",
) {
  return await repository.endPlaySession(sessionId, engagement);
}

