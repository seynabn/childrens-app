
const API_URL = "https://api.elevenlabs.io/v1";

// Våra egna feltyper gör att route-filen kan förstå vad som gick fel.
export type VoiceErrorCode =
  | "VOICE_CONFIGURATION_ERROR"
  | "VOICE_PROVIDER_PAYMENT_REQUIRED"
  | "VOICE_PROVIDER_AUTH_FAILED"
  | "VOICE_PROVIDER_RATE_LIMITED"
  | "VOICE_PROVIDER_UNAVAILABLE"
  | "VOICE_PROVIDER_REJECTED_REQUEST"
  | "VOICE_GENERATION_TIMEOUT"
  | "VOICE_GENERATION_FAILED";

export class VoiceGenerationError extends Error {
  constructor(
    public readonly code: VoiceErrorCode,
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "VoiceGenerationError";
  }
}

function getApiKey(): string {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new VoiceGenerationError(
      "VOICE_CONFIGURATION_ERROR",
      "ELEVENLABS_API_KEY saknas.",
      500,
    );
  }

  return apiKey;
}

export async function generateSpeech(
  text: string,
  voiceId: string,
): Promise<ArrayBuffer> {
  if (!text.trim()) {
    throw new VoiceGenerationError(
      "VOICE_PROVIDER_REJECTED_REQUEST",
      "Texten får inte vara tom.",
      400,
    );
  }

  if (!voiceId.trim()) {
    throw new VoiceGenerationError(
      "VOICE_CONFIGURATION_ERROR",
      "Voice ID saknas.",
      500,
    );
  }

  let response: Response;

  try {
    response = await fetch(
      `${API_URL}/text-to-speech/${encodeURIComponent(voiceId)}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": getApiKey(),
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          language_code: "sv",
        }),
        signal: AbortSignal.timeout(30_000),
      },
    );
  } catch (error) {
    // Om vi själva saknar API-nyckeln är det ett konfigurationsfel.
    if (error instanceof VoiceGenerationError) {
      throw error;
    }

    // Avbryt och rapportera om ElevenLabs inte svarar i tid.
    if (
      error instanceof Error &&
      error.name === "TimeoutError"
    ) {
      throw new VoiceGenerationError(
        "VOICE_GENERATION_TIMEOUT",
        "ElevenLabs svarade inte inom tidsgränsen.",
        504,
      );
    }

    // Nätverksfel, DNS-fel eller anslutningsproblem.
    throw new VoiceGenerationError(
      "VOICE_PROVIDER_UNAVAILABLE",
      "Kunde inte ansluta till ElevenLabs.",
      503,
    );
  }

  if (!response.ok) {
    // Läs svaret för att identifiera typen av fel.
    // Skicka aldrig hela detta meddelande till appen.
    const details = await response.text().catch(() => "");
    const lowerDetails = details.toLowerCase();

    if (
      lowerDetails.includes("payment_required") ||
      lowerDetails.includes("payment_issue") ||
      lowerDetails.includes("subscription has a failed")
    ) {
      throw new VoiceGenerationError(
        "VOICE_PROVIDER_PAYMENT_REQUIRED",
        "ElevenLabs har ett betalningsproblem.",
        503,
      );
    }

    if (response.status === 401 || response.status === 403) {
      throw new VoiceGenerationError(
        "VOICE_PROVIDER_AUTH_FAILED",
        "ElevenLabs nekade åtkomst.",
        502,
      );
    }

    if (response.status === 429) {
      throw new VoiceGenerationError(
        "VOICE_PROVIDER_RATE_LIMITED",
        "ElevenLabs begränsar antalet förfrågningar.",
        429,
      );
    }

    if (response.status >= 500) {
      throw new VoiceGenerationError(
        "VOICE_PROVIDER_UNAVAILABLE",
        "ElevenLabs har ett tillfälligt fel.",
        503,
      );
    }

    throw new VoiceGenerationError(
      "VOICE_PROVIDER_REJECTED_REQUEST",
      `ElevenLabs avvisade förfrågan (HTTP ${response.status}).`,
      502,
    );
  }

  return response.arrayBuffer();
}
