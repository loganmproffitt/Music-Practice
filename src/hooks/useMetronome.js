import { useState, useEffect } from "react";
import { startTransport, stopTransport, scheduleMetronome } from "../utils/metronomeTransport";
import { loadSounds, playBeat } from "../utils/metronomeAudio";
import { getBeatsPerMeasure } from "../utils/measureControls";
import * as Tone from "tone";

function useMetronome() {
  const [bpm, setBPM] = useState(120); // Actual BPM - set once slider released
  const [storedBPM, setStoredBPM] = useState(120); // Temp BPM while slider in progress
  const [isPlaying, setIsPlaying] = useState(false);

  const [measureSettings, setMeasureSettings] = useState({
    numerator: 4,
    denominator: 4,
    skipping: {
        skippingEnabled: false,
        measuresOn: 1,
        measuresOff: 1
    }
  });

  // Necessary?
  useEffect(() => {
    if (isPlaying) {
      stopTransport();
      setTimeout(() => {
        startTransport(playBeat, bpm, measureSettings);
      }, 50);
    }
  }, [measureSettings.skipping.skippingEnabled]);

  const togglePlaying = () => {
    Tone.start().then(() => {
      setIsPlaying(!isPlaying);
    });
  };

  const updateBPM = () => {
    setBPM(storedBPM);
    if (isPlaying) {
      stopTransport();
      startTransport(playBeat, storedBPM, measureSettings);
    }
  };

  useEffect(() => {
    loadSounds();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startTransport(playBeat, bpm, measureSettings);
    } else {
      stopTransport();
    }
  }, [isPlaying, bpm]);

  return { measureSettings, setMeasureSettings, storedBPM, setStoredBPM, isPlaying, togglePlaying, updateBPM };
}

export default useMetronome;
