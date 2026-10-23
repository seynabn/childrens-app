import { createElevenLabsVoiceProvider } from "../services/elevenlabs";

if (process.env.RUN_ELEVENLABS_SMOKE !== "1") {
  throw new Error(
    "Refusing a real provider call. Set RUN_ELEVENLABS_SMOKE=1 deliberately to continue.",
  );
}

const voiceId = process.env.ELEVENLABS_VOICE_ID;
const apiKey = process.env.ELEVENLABS_API_KEY;

if (!voiceId || !apiKey) {
  throw new Error("ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID is missing.");
}

const voice = createElevenLabsVoiceProvider(apiKey);
const audio = await voice.generateSpeech(
  "Hej! Ska vi upptäcka något spännande tillsammans?",
  voiceId,
);

console.log(`Speech generated. Audio size: ${audio.byteLength} bytes.`);
