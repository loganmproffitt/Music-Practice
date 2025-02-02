/*
    Manages transport and scheduling.
    - scheduleMetronome() cancels any current transport and schedules the metronome, calling playBeat().
    - startTransport(bpm) starts the transport with the given bpm value if not already started
    - stopTransport() stops and cancels the transport
*/

import * as Tone from "tone";

export function scheduleMetronome(playBeat) {
    const transport = Tone.getTransport();
    transport.cancel();
    transport.scheduleRepeat((time) => {
        playBeat(time);
    }, "4n");
}

export function startTransport(playBeat, bpm) {
    const transport = Tone.getTransport();

    transport.bpm.value = bpm;
    transport.start();

    setTimeout(() => {
        transport.start();
        scheduleMetronome(playBeat);
    }, 50);
}

export function stopTransport() {
    const transport = Tone.getTransport();
    Tone.getTransport().stop();
    Tone.getTransport().cancel()
}