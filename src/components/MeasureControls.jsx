import "../styles/App.css";
import { useMetronome } from "../context/MetronomeContext";

function MeasureControls() {

  const { measureSettings, setMeasureSettings } = useMetronome();

    return (
      <div>
        <h2>Settings</h2>

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
          <label>Skip Measures:
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
          </label>
        </div>

        <div>
          {/* Measures On Selection */}
          <label>Measures On:
          <select
            value={measureSettings.skipping.measuresOn}
            onChange={(e) =>
            setMeasureSettings((prev) => ({
              ...prev,
              skipping: {
                ...prev.skipping,
                measuresOn: Number(e.target.value),
              }
            }))
          }>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          </select>
          </label>
        </div>

        <div>
          {/* Measures Off Selection */}
          <label>Measures Off:
            <select
              value={measureSettings.skipping.measuresOff}
              onChange={(e) =>
              setMeasureSettings((prev) => ({
                ...prev,
                skipping: {
                  ...prev.skipping,
                  measuresOff: Number(e.target.value),
                }
              }))
            }>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            </select>
          </label>
        </div>
      
      </div>
      
    );
  }
  
  export default MeasureControls;  