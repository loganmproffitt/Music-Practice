import "../styles/App.css";

function MeasureControls({ settings, setSettings }) {

    return (
      <div>
        <h2>Measure Settings</h2>

        {/* Time signature settings */}
        <label>Time Signature:</label>
        {/* Numerator Selection */}
        <select
          value={settings.numerator}
          onChange={(e) =>
          setSettings((prev) => ({
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
          value={settings.denominator}
          onChange={(e) =>
          setSettings((prev) => ({
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
              checked={settings.skipping.skippingEnabled}
              onChange={() => setSettings((prev) => ({
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