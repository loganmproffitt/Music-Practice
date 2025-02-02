import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import "./Metronome.css";

function Metronome() {
  const [bpm, setBPM] = useState(120);
  const [storedBPM, setStoredBPM] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load the sound file using Tone.Player
  const synth = useRef(new Tone.Player().toDestination());

  const playBeat = (time) => {
    synth.current.seek(0, time);
    synth.current.start(time);
  };

  const scheduleMetronome = () => {
    Tone.getTransport().cancel();
    Tone.getTransport().scheduleRepeat((time) => {
      playBeat(time);
    }, "4n");
  };


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
        // Start scheduler
        scheduleMetronome()

        // If not started, start audio
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
