import { createContext, useContext, useState, useEffect, useRef } from "react";
import { loadSounds } from "../utils/metronomeAudio";
import * as Tone from "tone";

const MetronomeContext = createContext();

export function MetronomeProvider({ children }) {

    const maxMeasureSize = 12;

    const [currentBeat, setCurrentBeat] = useState(-1);
    const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);

    const [metronomeSettings, setMetronomeSettings] = useState({
        bpm: 120,
        isPlaying: false,
    });

    const [measureSettings, setMeasureSettings] = useState({
        numerator: 4,
        denominator: 4,
        mask: Array.from({length: maxMeasureSize}, () => 1),
        skipping: {
            skippingEnabled: false,
            measuresOn: 1,
            measuresOff: 1
        }
    });

    // TODO: Add beats per measure to measure settings
    useEffect(() => {
        if (!metronomeSettings.isPlaying) {
            setBeatsPerMeasure(measureSettings.numerator);
        }
    }, [measureSettings]);

    const toggleMaskIndex = (index) => {
        if (index >= maxMeasureSize) return;
        setMeasureSettings((prevSettings) => ({
            ...prevSettings,
            mask: prevSettings.mask.map((value, i) =>
                i === index ? (value === 1 ? 0 : 1) : value
            ),
        }));
    }


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
        });
    };

    return (
        <MetronomeContext.Provider value={{ 
            currentBeat, setCurrentBeat,
            beatsPerMeasure, setBeatsPerMeasure,
            metronomeSettings, metronomeSettingsRef, setMetronomeSettings,
            togglePlaying, 
            measureSettings, measureSettingsRef, setMeasureSettings,
            toggleMaskIndex
        }}>
            {children}
        </MetronomeContext.Provider>
    );
    
}

export function useMetronome() {
    return useContext(MetronomeContext);
}
