import { createContext, useContext, useState, useEffect, useRef } from "react";
//import { updateMetronomeSettings } from "../utils/metronomeTransport";
import { loadSounds } from "../utils/metronomeAudio";
import * as Tone from "tone";

const MetronomeContext = createContext();

export function MetronomeProvider({ children }) {

    const [currentBeat, setCurrentBeat] = useState(0);
    const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);

    const [metronomeSettings, setMetronomeSettings] = useState({
        bpm: 120,
        isPlaying: false,
    });

    const [measureSettings, setMeasureSettings] = useState({
        numerator: 4,
        denominator: 4,
        skipping: {
            skippingEnabled: false,
            measuresOn: 1,
            measuresOff: 1
        }
    });

    // Get references
    const metronomeSettingsRef = useRef(metronomeSettings);
    const measureSettingsRef = useRef(measureSettings);

    // Update references
    useEffect(() => {
        metronomeSettingsRef.current = metronomeSettings;
    }, [metronomeSettings]);

    useEffect(() => {
        measureSettingsRef.current = measureSettings;
    }, [measureSettings]);


    // Load metronome sound
    useEffect(() => {
        console.log("Loading metronome sound.");
        loadSounds();
    }, []);

    // Toggle metronome on/off
    const togglePlaying = () => {
        Tone.start().then(() => {
            setMetronomeSettings(prev => ({
                ...prev,
                isPlaying: !prev.isPlaying
            }));
            console.log("togglePlaying triggered.");
        });
    };

    return (
        <MetronomeContext.Provider value={{ 
            currentBeat, setCurrentBeat,
            beatsPerMeasure, setBeatsPerMeasure,
            metronomeSettings, metronomeSettingsRef, setMetronomeSettings,
            togglePlaying, 
            measureSettings, measureSettingsRef, setMeasureSettings 
        }}>
            {children}
        </MetronomeContext.Provider>
    );
    
}

export function useMetronome() {
    return useContext(MetronomeContext);
}
