export const config = {
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
  elevenLabsVoiceId: process.env.ELEVENLABS_VOICEID,
};

export function requireElevenLabsApiKey(): string {
  if (!config.elevenLabsApiKey) {
    throw new Error("ELEVENLABS_API_KEY saknas.");
  }

  return config.elevenLabsApiKey;
}

export function requireElevenLabsVoiceId(): string {
  if (!config.elevenLabsVoiceId) {
    throw new Error("ELEVENLABS_VOICE_ID saknas.");
  }

  return config.elevenLabsVoiceId;
}