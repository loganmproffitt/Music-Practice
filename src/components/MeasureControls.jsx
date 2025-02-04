import "../styles/App.css";
import "../styles/MeasureControls.css";
import { useMetronome } from "../context/MetronomeContext";

function MeasureControls() {
  const { measureSettings, setMeasureSettings } = useMetronome();

  return (
    <div className="measure-controls"> 

      {/* Time Signature settings */}
      <div className="select-container">
        <label className="label">Time Signature:</label>
        <div className="select-group">
          {/* Numerator Selection */}
          <select
            className="select"
            value={measureSettings.numerator}
            onChange={(e) =>
              setMeasureSettings((prev) => ({
                ...prev,
                numerator: Number(e.target.value),
              }))
            }
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="6">6</option>
          </select>

          {/* Denominator Selection */}
          <select
            className="select"
            value={measureSettings.denominator}
            onChange={(e) =>
              setMeasureSettings((prev) => ({
                ...prev,
                denominator: Number(e.target.value),
              }))
            }
          >
            <option value="4">4</option>
            <option value="8">8</option>
          </select>
        </div>
      </div>

      {/* Toggle Switch for Skip Measures */}
      <div className="checkbox-container">
        <label className="label">Skip Measures:</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={measureSettings.skipping.skippingEnabled}
            onChange={() =>
              setMeasureSettings((prev) => ({
                ...prev,
                skipping: {
                  ...prev.skipping,
                  skippingEnabled: !prev.skipping.skippingEnabled,
                },
              }))
            }
          />
          <span className="slider round"></span>
        </label>
      </div>

      {/* Measures On Selection */}
      <div className="select-container">
        <label className="label">Measures On:</label>
        <select
          className="select"
          value={measureSettings.skipping.measuresOn}
          onChange={(e) =>
            setMeasureSettings((prev) => ({
              ...prev,
              skipping: {
                ...prev.skipping,
                measuresOn: Number(e.target.value),
              },
            }))
          }
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
      </div>

      {/* Measures Off Selection */}
      <div className="select-container">
        <label className="label">Measures Off:</label>
        <select
          className="select"
          value={measureSettings.skipping.measuresOff}
          onChange={(e) =>
            setMeasureSettings((prev) => ({
              ...prev,
              skipping: {
                ...prev.skipping,
                measuresOff: Number(e.target.value),
              },
            }))
          }
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
      </div>
    </div>
  );
}

export default MeasureControls;
