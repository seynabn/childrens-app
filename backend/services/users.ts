import * as repository from "../repository";

// Skapar en användare och hash:ar lösenordet först.
export async function createUser(email: string, password: string) {
  const passwordHash = await Bun.password.hash(password);

  return await repository.createUser(email, passwordHash);
}

// Kontrollerar e-postadress och lösenord vid inloggning.
export async function loginUser(email: string, password: string) {
  const user = await repository.findUserByEmail(email);

  // Samma fel för okänd e-postadress och fel lösenord.
  if (!user) {
    return null;
  }

  const passwordIsCorrect = await Bun.password.verify(
    password,
    user.password_hash,
  );

  if (!passwordIsCorrect) {
    return null;
  }

  // Skicka aldrig lösenordshashen vidare till klienten.
  return {
    user_id: user.user_id,
    email: user.email,
    created_at: user.created_at,
  };
}

// Hämtar användaren som hör till ett visst ID.
export async function getUserById(userId: string) {
  return await repository.findUserById(userId);
}