
import sql from "../db";

// Hämtar endast barn som tillhör användaren.
export async function findChildrenByUserId(userId: string) {
  const children = await sql`
    SELECT
      child_id,
      user_id,
      nickname,
      birth_month,
      birth_year,
      created_at
    FROM children
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;

  return children;
}

// Skapar en barnprofil kopplad till rätt användare.
export async function createChild(
  userId: string,
  nickname: string | null,
  birthMonth: number,
  birthYear: number,
) {
  const children = await sql`
    INSERT INTO children (
      user_id,
      nickname,
      birth_month,
      birth_year
    )
    VALUES (
      ${userId},
      ${nickname},
      ${birthMonth},
      ${birthYear}
    )
    RETURNING
      child_id,
      user_id,
      nickname,
      birth_month,
      birth_year,
      created_at
  `;

  return children[0];
}

// Hämtar ett specifikt barn endast om det tillhör användaren.
export async function findChildByIdAndUserId(
  childId: string,
  userId: string,
) {
  const children = await sql`
    SELECT
      child_id,
      user_id,
      nickname,
      birth_month,
      birth_year,
      created_at
    FROM children
    WHERE child_id = ${childId}
      AND user_id = ${userId}
    LIMIT 1
  `;

  return children[0] ?? null;
}

// Uppdaterar ett barn endast om det tillhör användaren.
export async function updateChildByIdAndUserId(
  childId: string,
  userId: string,
  nickname: string | null,
) {
  const children = await sql`
    UPDATE children
    SET nickname = ${nickname}
    WHERE child_id = ${childId}
      AND user_id = ${userId}
    RETURNING
      child_id,
      user_id,
      nickname,
      birth_month,
      birth_year,
      created_at
  `;

  return children[0] ?? null;
}



// Tar bort ett barn endast om det tillhör användaren.
export async function deleteChildByIdAndUserId(
  childId: string,
  userId: string,
) {
  const children = await sql`
    DELETE FROM children
    WHERE child_id = ${childId}
      AND user_id = ${userId}
    RETURNING
      child_id,
      user_id,
      nickname,
      birth_month,
      birth_year,
      created_at
  `;

  return children[0] ?? null;
}
