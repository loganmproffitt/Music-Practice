/*
    Manages transport and scheduling.
    - scheduleMetronome() cancels any current transport and schedules the metronome, calling playBeat().
    - startTransport(bpm) starts the transport with the given bpm value if not already started
    - stopTransport() stops and cancels the transport
*/

import * as Tone from "tone";
import { shouldPlayBeat, getCycleLength, getBeatsOn } from "./measureControls";
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

        // If skipping disabled, update settings and cycle length immediately. Otherwise, update in first half
        if (!localMeasureSettings.skipping.skippingEnabled || beatCount < getBeatsOn(localMeasureSettings)) {
            localMeasureSettings = measureSettingsRef.current;
            cycleLength = getCycleLength(localMeasureSettings);
        }

        // Check whether the current beat is skipped
        if (shouldPlayBeat(beatCount, localMeasureSettings)) {
            playBeat(time);
        } else {
            console.log("Skipping");
            transport.scheduleOnce(() => {}, time); // If skipping, schedule empty beat
        }

        // Update beat count and apply setting changes if needed
        beatCount = (beatCount + 1) % cycleLength;

    }, "4n");
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