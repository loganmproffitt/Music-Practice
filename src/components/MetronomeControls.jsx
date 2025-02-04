import "../styles/App.css";
import "../styles/MetronomeControls.css";
import { useMetronome } from "../context/MetronomeContext";
import { useMetronomeScheduler } from "../hooks/useMetronomeScheduler";

function MetronomeControls() {
  useMetronomeScheduler();

  const { metronomeSettings, setMetronomeSettings, togglePlaying } = useMetronome();

    return (
      <div className="metronome-controls">
        <h2>{metronomeSettings.bpm} BPM</h2>
  
        {/* BPM Slider */}
        <input
          type="range"
          min="40"
          max="240"
          step="1"
          value={metronomeSettings.bpm}
          onChange={(e) => setMetronomeSettings((prev) => ({
            ...prev,
            bpm: Number(e.target.value),
          }))}
        />
  
        {/* Play / Stop Button */}
        <button className={`play-button ${metronomeSettings.isPlaying ? "playing" : ""}`} onClick={togglePlaying}>
          {metronomeSettings.isPlaying ? "Stop" : "Start"}
        </button>

      </div>
    );
  }
  
  export default MetronomeControls;  