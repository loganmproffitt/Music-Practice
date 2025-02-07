import "../styles/App.css";
import "../styles/Visualization.css";
import { useMetronome } from "../context/MetronomeContext";

function Visualization() {
    const { currentBeat, beatsPerMeasure } = useMetronome();

    return (
        <div className="visualization">
            {Array.from({ length: beatsPerMeasure }, (_, index) => (
                <div
                    key={index}
                    className={`beat ${index === currentBeat ? "active" : ""}`}
                >
                    {index + 1}
                </div>
            ))}
        </div>
    );
}

export default Visualization;
