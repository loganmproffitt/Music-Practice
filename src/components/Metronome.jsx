import MetronomeControls from "./metronomeControls";
import MeasureControls from "./MeasureControls";
import "../styles/App.css";

import useMetronome from "../hooks/useMetronome";

function Metronome() {
  const { measureSettings, setMeasureSettings, bpm, storedBPM, setStoredBPM, isPlaying, togglePlaying, updateBPM } = useMetronome();

  return (
    <div>
      <h1>Metronome</h1>
      <MetronomeControls bpm={bpm} storedBPM={storedBPM} setStoredBPM={setStoredBPM} isPlaying={isPlaying} togglePlaying={togglePlaying} updateBPM={updateBPM}/>
      <MeasureControls settings={measureSettings} setSettings={setMeasureSettings}/>
    </div>
  );
}

export default Metronome;
