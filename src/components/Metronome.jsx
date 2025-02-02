import useMetronome from "../hooks/useMetronome";
import MetronomeControls from "./metronomeControls";
import "../styles/App.css";

function Metronome() {
  const { bpm, storedBPM, setStoredBPM, isPlaying, togglePlaying, updateBPM } = useMetronome();

  return (
    <div>
      <h1>Metronome</h1>
      <MetronomeControls bpm={bpm} storedBPM={storedBPM} setStoredBPM={setStoredBPM} isPlaying={isPlaying} togglePlaying={togglePlaying} updateBPM={updateBPM}/>
    </div>
  );
}

export default Metronome;
