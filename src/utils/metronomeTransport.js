/*
    Manages transport and scheduling.
    - scheduleMetronome() cancels any current transport and schedules the metronome, calling playBeat().
    - startTransport(bpm) starts the transport with the given bpm value if not already started
    - stopTransport() stops and cancels the transport
*/

import * as Tone from "tone";
import { shouldPlayBeat, getCycleLength, getBeatsOn, getSubdivisionValue, getBeatsPerMeasure } from "./measureControls";
import { useRef } from "react";

export function scheduleMetronome(playBeat, metronomeSettingsRef, measureSettingsRef) {
    // Get transport, cancel current schedule
    const transport = Tone.getTransport();
    transport.cancel();
    let localMeasureSettings = measureSettingsRef.current;

    let beatCount = 0;
    let cycleLength = getCycleLength(localMeasureSettings);

    // Start scheduling
    transport.scheduleRepeat((time) => {

        // Check whether metronome has been turned off, exit gracefully
        if (!metronomeSettingsRef.current.isPlaying) {
            // Schedule empty beat, then stop transport
            transport.scheduleOnce(() => {}, time);
            stopTransport();
            return;
        }

        // Update bpm
        transport.bpm.value = metronomeSettingsRef.current.bpm;


        // Check whether to update settings
        if (shouldUpdateSettings(beatCount, localMeasureSettings, measureSettingsRef)) {
            localMeasureSettings = measureSettingsRef.current;
            cycleLength = getCycleLength(localMeasureSettings);
        }

        // Check whether the current beat is skipped
        if (shouldPlayBeat(beatCount, localMeasureSettings, measureSettingsRef)) {
            playBeat(time);
        } else {
            transport.scheduleOnce(() => {}, time); // If skipping, schedule empty beat
        }

        // Update beat count and apply setting changes if needed
        beatCount = (beatCount + 1) % cycleLength;

    }, getSubdivisionValue(measureSettingsRef.current.denominator));
}

export function startTransport(playBeat, metronomeSettingsRef, measureSettingsRef) {
    console.log("Starting transport.");
    const transport = Tone.getTransport();

    //transport.bpm.value = metronomeSettingsRef.current.bpm;
    transport.start();
    scheduleMetronome(playBeat, metronomeSettingsRef, measureSettingsRef);
}

export function stopTransport() {
    console.log("Stopping transport.");
    const transport = Tone.getTransport();
    Tone.getTransport().stop();
    Tone.getTransport().cancel()
}

export function shouldUpdateSettings(beatCount, localMeasureSettings, measureSettingsRef) {
    console.log("beatCount:", beatCount + 1);
    // If on first beat, update
    if (beatCount == 0) return true;

    // SKIPPING ON
    if (localMeasureSettings.skipping.skippingEnabled) {
        // If in beatsOff, wait
        if (beatCount >= getBeatsOn(localMeasureSettings)) return false;

        // beatsOn = true
        // WAIT if numerator < current
        if (measureSettingsRef.current.numerator < localMeasureSettings.numerator) return false;

        // Check if new measuresOn is less than current
        if (measureSettingsRef.current.skipping.measuresOn < localMeasureSettings.skipping.measuresOn) {
            // If beatCount is still in beatsOn, UPDATE
            return beatCount < getBeatsOn(measureSettingsRef.current);
        }
        // Otherwise, wait
        return true;
    }
    // SKIPPING OFF
    else {
        // WAIT if new numerator is less
        if (measureSettingsRef.current.numerator < localMeasureSettings.numerator) return false;
        // WAIT if skipping enabled and time signature change
        if (measureSettingsRef.current.skipping.skippingEnabled == true 
            && measureSettingsRef.current.numerator != localMeasureSettings.numerator) return false;
        else return true;
    }
}