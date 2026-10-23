
const API_URL = "https://api.elevenlabs.io/v1";

export interface VoiceProvider {
  generateSpeech(text: string, voiceId: string): Promise<ArrayBuffer>;
}

async function requestSpeech(
  text: string,
  voiceId: string,
  apiKey: string,
): Promise<ArrayBuffer> {
  if (!text.trim()) {
    throw new Error("Texten får inte vara tom.");
  }

  if (!voiceId.trim()) {
    throw new Error("Voice ID saknas.");
  }

  const response = await fetch(
    `${API_URL}/text-to-speech/${encodeURIComponent(voiceId)}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
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

  if (!response.ok) {
    const details = await response.text();

    throw new Error(
      `ElevenLabs-fel (${response.status}): ${details.slice(0, 500)}`,
    );
  }

  return response.arrayBuffer();
}

export function createElevenLabsVoiceProvider(apiKey: string): VoiceProvider {
  return { generateSpeech: (text, voiceId) => requestSpeech(text, voiceId, apiKey) };
}
