import "../styles/App.css";
import { useMetronome } from "../context/MetronomeContext";

function MeasureControls() {

  const { measureSettings, setMeasureSettings } = useMetronome();

    return (
      <div>
        <h2>Measure Settings</h2>

        {/* Time signature settings */}
        <label>Time Signature:</label>
        {/* Numerator Selection */}
        <select
          value={measureSettings.numerator}
          onChange={(e) =>
          setMeasureSettings((prev) => ({
            ...prev,
            numerator: Number(e.target.value),
          }))
        }>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="6">6</option>
        </select>

        {/* Denominator Selection */}
        <select
          value={measureSettings.denominator}
          onChange={(e) =>
          setMeasureSettings((prev) => ({
            ...prev,
            denominator: Number(e.target.value),
          }))
        }>
        <option value="4">4</option>
        <option value="8">8</option>
        </select>
        
        <div>
          {/* Skip Measures Selection */}
          <label>
            <input
              type="checkbox"
              checked={measureSettings.skipping.skippingEnabled}
              onChange={() => setMeasureSettings((prev) => ({
                ...prev,
                skipping: {
                  ...prev.skipping,
                  skippingEnabled: !prev.skipping.skippingEnabled
                }
              }))}
            />
          Skip Measures:</label>
        </div>
     
      </div>
      
    );
  }
  
  export default MeasureControls;  