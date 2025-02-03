/*
    Manages transport and scheduling.
    - scheduleMetronome() cancels any current transport and schedules the metronome, calling playBeat().
    - startTransport(bpm) starts the transport with the given bpm value if not already started
    - stopTransport() stops and cancels the transport
*/

import * as Tone from "tone";
import { shouldPlayBeat } from "./measureControls";
import { useRef } from "react";

export function scheduleMetronome(playBeat, metronomeSettingsRef, measureSettingsRef) {
    console.log("scheduleMetronome called with measureSettings = ", measureSettingsRef.current);
    const transport = Tone.getTransport();
    transport.cancel();

    let beatCount = 0;

    transport.scheduleRepeat((time) => {

        // Check whether metronome has been turned off, exit gracefully
        if (!metronomeSettingsRef.current.isPlaying) {
            stopTransport();
            return;
        }

        // Check bpm
        transport.bpm.value = metronomeSettingsRef.current.bpm;

        // Check whether the current beat is skipped
        if (shouldPlayBeat(beatCount, measureSettingsRef.current)) {
            playBeat(time);
        } else {
            transport.scheduleOnce(() => {}, time); // If skipping, schedule empty beat
        }
        beatCount = beatCount + 1;
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