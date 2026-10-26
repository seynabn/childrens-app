import * as repository from "../repository";

// Hämtar ord genom repository-lagret.
export async function getWords() {
  return await repository.getWords();
}