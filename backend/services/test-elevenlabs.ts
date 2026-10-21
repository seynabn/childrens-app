
import { generateSpeech } from "./elevenlabs";

const voiceId = process.env.ELEVENLABS_VOICEID;

if (!voiceId) {
  throw new Error("ELEVENLABS_VOICE_ID saknas.");
}

try {
  const audio = await generateSpeech(
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
