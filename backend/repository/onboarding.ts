import sql from "../db";

// Svarsalternativ som onboarding tillåter.
export type OnboardingAnswers = {
  canYourChildSpeak: "not_yet" | "some" | "many";
  combinesWords: "not_yet" | "sometimes" | "often" | null;
  swedishExposure:
    | "mostly_swedish"
    | "several_languages"
    | "some_swedish"
    | "little_swedish"
    | null;
  otherLanguages: string[];
  communicationModes: string[];
  useNameInSpeech: boolean;
  namePronunciationConfirmed: boolean;
};

// Hämtar onboarding-svaren för ett barn.
export async function findOnboardingByChildId(childId: string) {
  const rows = await sql`
    SELECT
      onboarding_id,
      child_id,
      can_your_child_speak,
      combines_words,
      swedish_exposure,
      other_languages,
      communication_modes,
      use_name_in_speech,
      name_pronunciation_confirmed,
      completed_at,
      created_at,
      updated_at
    FROM onboarding_info
    WHERE child_id = ${childId}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

// Skapar eller uppdaterar onboarding-svaren för ett barn.
export async function saveOnboardingByChildId(
  childId: string,
  answers: OnboardingAnswers,
) {
  const rows = await sql`
    INSERT INTO onboarding_info (
      child_id,
      can_your_child_speak,
      combines_words,
      swedish_exposure,
      other_languages,
      communication_modes,
      use_name_in_speech,
      name_pronunciation_confirmed,
      completed_at,
      updated_at
    )
    VALUES (
      ${childId},
      ${answers.canYourChildSpeak},
      ${answers.combinesWords},
      ${answers.swedishExposure},
      ${answers.otherLanguages},
      ${answers.communicationModes},
      ${answers.useNameInSpeech},
      ${answers.namePronunciationConfirmed},
      NOW(),
      NOW()
    )
    ON CONFLICT (child_id)
    DO UPDATE SET
      can_your_child_speak = EXCLUDED.can_your_child_speak,
      combines_words = EXCLUDED.combines_words,
      swedish_exposure = EXCLUDED.swedish_exposure,
      other_languages = EXCLUDED.other_languages,
      communication_modes = EXCLUDED.communication_modes,
      use_name_in_speech = EXCLUDED.use_name_in_speech,
      name_pronunciation_confirmed = EXCLUDED.name_pronunciation_confirmed,
      completed_at = NOW(),
      updated_at = NOW()
    RETURNING
      onboarding_id,
      child_id,
      can_your_child_speak,
      combines_words,
      swedish_exposure,
      other_languages,
      communication_modes,
      use_name_in_speech,
      name_pronunciation_confirmed,
      completed_at,
      created_at,
      updated_at
  `;

  return rows[0];
}
