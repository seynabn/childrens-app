
import * as repository from "../repository";

// Hämtar barn som tillhör en viss användare.
export async function getChildrenByUserId(userId: string) {
  return await repository.findChildrenByUserId(userId);
}

// Skapar ett barn åt den inloggade användaren.
export async function createChild(
  userId: string,
  nickname: string | null,
  birthMonth: number,
  birthYear: number,
) {
  return await repository.createChild(
    userId,
    nickname,
    birthMonth,
    birthYear,
  );
}
// Hämtar ett specifikt barn om det tillhör användaren.
export async function getChildByIdAndUserId(
  childId: string,
  userId: string,
) {
  return await repository.findChildByIdAndUserId(childId, userId);
}


 // Uppdaterar smeknamnet på ett barn som tillhör användaren.
export async function updateChildByIdAndUserId(
  childId: string,
  userId: string,
  nickname: string | null,
) {
  return await repository.updateChildByIdAndUserId(
    childId,
    userId,
    nickname,
  );
}

 // Tar bort en barnprofil om den tillhör användaren.
export async function deleteChildByIdAndUserId(
  childId: string,
  userId: string,
) {
  return await repository.deleteChildByIdAndUserId(
    childId,
    userId,
  );
}
