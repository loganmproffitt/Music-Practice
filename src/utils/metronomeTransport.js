/*
    Manages transport and scheduling.
    - scheduleMetronome() cancels any current transport and schedules the metronome, calling playBeat().
    - startTransport(bpm) starts the transport with the given bpm value if not already started
    - stopTransport() stops and cancels the transport
*/

import * as Tone from "tone";
import { shouldPlayBeat } from "./measureControls";

export function scheduleMetronome(playBeat, measureSettings) {
    const transport = Tone.getTransport();
    transport.cancel();

    let beatCount = 0;

    transport.scheduleRepeat((time) => {
        // Check whether the current beat is skipped
        if (shouldPlayBeat(beatCount, measureSettings)) {
            playBeat(time);
        }
        beatCount = beatCount + 1;
    }, "4n");
}

export function startTransport(playBeat, bpm, measureSettings) {
    const transport = Tone.getTransport();

    transport.bpm.value = bpm;
    transport.start();

    setTimeout(() => {
        transport.start();
        scheduleMetronome(playBeat, measureSettings);
    }, 50);
}

export function stopTransport() {
    const transport = Tone.getTransport();
    Tone.getTransport().stop();
    Tone.getTransport().cancel()
}