/*
    Manages transport and scheduling.
    - scheduleMetronome() cancels any current transport and schedules the metronome, calling playBeat().
    - startTransport(bpm) starts the transport with the given bpm value if not already started
    - stopTransport() stops and cancels the transport
*/

import * as Tone from "tone";
import { shouldPlayBeat, getCycleLength, getSubdivisionValue, shouldUpdateSettings, getBeatsPerMeasure } from "./measureControls";

export function scheduleMetronome(playBeat, metronomeSettingsRef, measureSettingsRef, setCurrentBeat, setBeatsPerMeasure) {
    // Get transport, cancel current schedule
    const transport = Tone.getTransport();
    transport.cancel();
    let localMeasureSettings = measureSettingsRef.current;

    let measureBeat = 0;
    let cycleBeat = 0;
    let cycleLength = getCycleLength(localMeasureSettings);

    // TODO: Get flags from flagEvaluator to determine whether to update
    setBeatsPerMeasure(getBeatsPerMeasure(localMeasureSettings.numerator, localMeasureSettings.denominator));

    // Start scheduling
    transport.scheduleRepeat((time) => {

        // Check whether metronome has been turned off, exit gracefully
        if (!metronomeSettingsRef.current.isPlaying) {
            // Schedule empty beat, then stop transport
            transport.scheduleOnce(() => {}, time);

            stopTransport();
            return;
        }

        // Update beat for UI
        setCurrentBeat(measureBeat);

        // Update bpm
        transport.bpm.value = metronomeSettingsRef.current.bpm;


        // Check whether the current beat is skipped
        if (shouldPlayBeat(cycleBeat, localMeasureSettings, measureSettingsRef)) {
            playBeat(time);
        } else {
            transport.scheduleOnce(() => {}, time); // If skipping, schedule empty beat
        }

        // Check whether to update settings
        if (shouldUpdateSettings(cycleBeat, localMeasureSettings, measureSettingsRef)) {
            localMeasureSettings = measureSettingsRef.current;
            cycleLength = getCycleLength(localMeasureSettings);

            // TODO: Get flags from flagEvaluator to determine whether to update
            setBeatsPerMeasure(getBeatsPerMeasure(localMeasureSettings.numerator, localMeasureSettings.denominator));
        }

        // Update current beat
        measureBeat = (measureBeat + 1) % getBeatsPerMeasure(localMeasureSettings.numerator, localMeasureSettings.denominator);
        cycleBeat = (cycleBeat + 1) % cycleLength;

    }, getSubdivisionValue(measureSettingsRef.current.denominator));
}

export function startTransport(playBeat, metronomeSettingsRef, measureSettingsRef) {
    console.log("Starting transport.");
    const transport = Tone.getTransport();

    transport.start();
}

export function stopTransport() {
    console.log("Stopping transport.");
    const transport = Tone.getTransport();
    Tone.getTransport().stop();
    Tone.getTransport().cancel()
}