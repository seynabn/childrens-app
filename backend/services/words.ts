import * as repository from "../repository";

// Hämtar ord genom repository-lagret.
export async function getWords() {
  return await repository.getWords();
}

// Hämtar alternativa ord genom repository-lagret.
export async function getWordChoices(wordId: string) {
  return await repository.getWordChoices(wordId);
}