import "../styles/App.css";
import "../styles/Visualization.css";
import { useMetronome } from "../context/MetronomeContext";

function Visualization() {
    const { currentBeat, beatsPerMeasure, measureSettings, toggleMaskIndex } = useMetronome();

    return (
        <div className="visualization">
            {Array.from({ length: beatsPerMeasure }, (_, index) => (
                <div
                    key={index}
                    className={`beat ${measureSettings.mask[index] !== 0 ? (index === currentBeat ? "active" : "") : "muted"}`}
                    onClick={() => toggleMaskIndex(index)}
                >
    
                </div>
            ))}
        </div>
    );
}

export default Visualization;
