import "../styles/App.css";
import "../styles/MetronomeControls.css";
import { useMetronome } from "../context/MetronomeContext";
import { useMetronomeScheduler } from "../hooks/useMetronomeScheduler";
import { Play, Pause } from "lucide-react";

function MetronomeControls() {
  useMetronomeScheduler();

  const { metronomeSettings, setMetronomeSettings, togglePlaying } = useMetronome();

    return (
      <div className="metronome-controls">
        {/* BPM and Slider Stacked */}
        <div className="bpm-container">
          <h2>{metronomeSettings.bpm} BPM</h2>
          {/* BPM Slider */}
          <input 
            className="bpm-slider"
            type="range"
            min="10"
            max="240"
            step="1"
            value={metronomeSettings.bpm}
            onChange={(e) => setMetronomeSettings((prev) => ({
              ...prev,
              bpm: Number(e.target.value),
            }))}
          />
        </div>
  
        {/* Play / Pause Button */}
      <button className="play-button" onClick={togglePlaying}>
        {metronomeSettings.isPlaying ? <Pause size={28} /> : <Play size={28} />}
      </button>

      </div>
    );
  }
  
  export default MetronomeControls;  