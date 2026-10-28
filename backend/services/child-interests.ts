import * as repository from "../repository";
import type { ChildInterestInput } from "../repository/child-interests";

// Hämtar intressen för ett barn.
export async function getChildInterests(childId: string) {
  return await repository.findChildInterests(childId);
}

// Sparar barnets valda intressen.
export async function saveChildInterests(
  childId: string,
  interests: ChildInterestInput[],
) {
  return await repository.saveChildInterests(childId, interests);
}
