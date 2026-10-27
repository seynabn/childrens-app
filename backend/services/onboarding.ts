
import * as repository from "../repository";
import type { OnboardingAnswers } from "../repository/onboarding";

// Hämtar onboarding-svaren för ett barn.
export async function getOnboardingByChildId(childId: string) {
  return await repository.findOnboardingByChildId(childId);
}

// Sparar eller uppdaterar onboarding-svaren för ett barn.
export async function saveOnboardingByChildId(
  childId: string,
  answers: OnboardingAnswers,
) {
  return await repository.saveOnboardingByChildId(childId, answers);
}
