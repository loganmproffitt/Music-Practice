import MetronomeControls from "./metronomeControls";
import MeasureControls from "./MeasureControls";
import { MetronomeProvider } from "../context/MetronomeContext";
import "../styles/App.css";

function Metronome() {

  return (
    <div>
      <h1>Metronome</h1>
      <MetronomeProvider>
        <MetronomeControls/>
        <MeasureControls/>
      </MetronomeProvider>
    </div>
  );
}

export default Metronome;
