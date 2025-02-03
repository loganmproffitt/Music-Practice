/*
    Manages individual beats and their audio
    - Loads the selected sound
    - Plays sound
    - Determines whether the current beat is accented or skipped
*/

import * as Tone from "tone";
import woodblock from "../assets/sounds/woodblock.wav";

const synth = new Tone.Player().toDestination();

export function loadSounds() {
    synth.load(woodblock).then(() => {
      console.log("Sound loaded.");
    }).catch((err) => console.error("Error loading sound:", err));
  }
  
export function playBeat(time) {
  if (synth.loaded) {
    synth.seek(0, time);
    synth.start(time);
  }
}
