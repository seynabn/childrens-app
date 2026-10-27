import sql from "../db";

// Sparar en ny användare i databasen.
export async function createUser(
  email: string,
  passwordHash: string,
) {
  const users = await sql`
    INSERT INTO users (email, password_hash)
    VALUES (${email}, ${passwordHash})
    RETURNING user_id, email, created_at
  `;

  return users[0];
}

// Hämtar en användare med hjälp av e-postadressen.
export async function findUserByEmail(email: string) {
  const users = await sql`
    SELECT user_id, email, password_hash, created_at
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;

  return users[0] ?? null;
}

// Hämtar en användare med hjälp av användarens ID.
export async function findUserById(userId: string) {
  const users = await sql`
    SELECT user_id, email, created_at
    FROM users
    WHERE user_id = ${userId}
    LIMIT 1
  `;

  return users[0] ?? null;
}