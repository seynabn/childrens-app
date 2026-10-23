
import { createElevenLabsVoiceProvider } from "./elevenlabs";

const voiceId = process.env.ELEVENLABS_VOICE_ID;
const apiKey = process.env.ELEVENLABS_API_KEY;

if (!voiceId || !apiKey) {
  throw new Error("ELEVENLABS_API_KEY eller ELEVENLABS_VOICE_ID saknas.");
}

const voice = createElevenLabsVoiceProvider(apiKey);

try {
  const audio = await voice.generateSpeech(
    "Hej! Ska vi upptäcka något spännande tillsammans?",
    voiceId,
  );

  console.log(`Tal genererat. Ljudstorlek: ${audio.byteLength} byte.`);
} catch (error) {
  console.error(
    "ElevenLabs-testet misslyckades:",
    error instanceof Error ? error.message : "Okänt fel",
  );

  process.exitCode = 1;
}
