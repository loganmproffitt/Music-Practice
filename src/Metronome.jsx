import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import "./Metronome.css";

function Metronome() {
  const [bpm, setBPM] = useState(120);
  const [storedBPM, setStoredBPM] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load the sound file using Tone.Player
  const synth = useRef(new Tone.Player().toDestination());

  // Load audio
  useEffect(() => {
    synth.current.load("./src/assets/sounds/woodblock.wav").then(() => {
      console.log("Metronome sound loaded.");
    });
  }, []);

  useEffect(() => {
    const transport = Tone.getTransport();
    transport.bpm.value = bpm;

    if (isPlaying) {
      Tone.start().then(() => {
        transport.cancel();

        transport.scheduleRepeat((time) => {
          if (synth.current.loaded) {
            synth.current.seek(0, time); // Reset the playback position
            synth.current.start(time);
          }
        }, "4n");

        if (transport.state !== "started") {
          transport.start();
        }
      });
    } else {
      transport.stop();
      transport.cancel();
    }

    return () => {
      transport.cancel();
    };
  }, [isPlaying, bpm]);

  return (
    <div>
      <h1>Metronome</h1>
      <div className="card">
        <h2>{bpm} BPM</h2>
        <input
          type="range"
          min="20"
          max="240"
          step="1"
          value={storedBPM}
          onChange={(e) => setStoredBPM(Number(e.target.value))}
          onMouseUp={() => setBPM(storedBPM)}
          onTouchEnd={() => setBPM(storedBPM)}
        />
      </div>

      <button
        onClick={() => {
          Tone.start();
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? "Stop" : "Start"}
      </button>
    </div>
  );
}

export default Metronome;
