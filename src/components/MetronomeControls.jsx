import "../styles/App.css";

function MetronomeControls({ bpm, storedBPM, setStoredBPM, isPlaying, togglePlaying, updateBPM }) {

    return (
      <div>
        <h2>{storedBPM} BPM</h2>
  
        {/* BPM Slider */}
        <input
          type="range"
          min="40"
          max="240"
          step="1"
          value={storedBPM}
          onChange={(e) => setStoredBPM(Number(e.target.value))}
          onMouseUp={updateBPM}
          onTouchEnd={updateBPM}
        />
  
        {/* Play / Stop Button */}
        <button onClick={togglePlaying}>
          {isPlaying ? "Stop" : "Start"}
        </button>

      </div>
    );
  }
  
  export default MetronomeControls;  