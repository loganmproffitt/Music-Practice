import { useEffect, useRef } from "react";
import { useMetronome } from "../context/MetronomeContext"; 
import { startTransport, scheduleMetronome } from "../utils/metronomeTransport";
import { playBeat } from "../utils/metronomeAudio";

export function useMetronomeScheduler() {
  const { metronomeSettings, measureSettings, metronomeSettingsRef, measureSettingsRef } = useMetronome();

  // Observe change in isPlaying in context and start the metronome
  useEffect(() => {
    if (metronomeSettings.isPlaying) {
      // Turn on the metronome
      console.log("useMetronomeScheduler starting metronome.");
      startTransport(playBeat, metronomeSettingsRef, measureSettingsRef);
      scheduleMetronome(playBeat, metronomeSettingsRef, measureSettingsRef)
    }
  }, [metronomeSettings.isPlaying]);
}
