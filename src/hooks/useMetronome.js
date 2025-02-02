import { useState, useEffect } from "react";
import { startTransport, stopTransport, scheduleMetronome } from "../utils/metronomeTransport";
import { loadSounds, playBeat } from "../utils/metronomeAudio";
import * as Tone from "tone";

function useMetronome() {
  const [bpm, setBPM] = useState(120); // Actual BPM - set once slider released
  const [storedBPM, setStoredBPM] = useState(120); // Temp BPM while slider in progress
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlaying = () => {
    Tone.start().then(() => {
      setIsPlaying(!isPlaying);
    });
  };

  const updateBPM = () => {
    setBPM(storedBPM);
    if (isPlaying) {
      stopTransport();
      startTransport(playBeat, storedBPM);
    }
  };

  useEffect(() => {
    loadSounds();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startTransport(playBeat, bpm);
    } else {
      stopTransport();
    }
  }, [isPlaying, bpm]);

  return { bpm, storedBPM, setStoredBPM, isPlaying, togglePlaying, updateBPM };
}

export default useMetronome;
