import { evaluateMeasureChanges } from "./measureChangesEvaluator.js";

export const measureSettings = {
    // Time signature
    numerator: 4,
    denominator: 4,
    // Skipping settings
    skipping: {
        skippingEnabled: false,
        measuresOn: 1,
        measuresOff: 1
    }
};

export function getBeatsOn(measureSettings) {
    return getBeatsPerMeasure(measureSettings.numerator) * measureSettings.skipping.measuresOn;
}

export function getCycleLength(measureSettings) {
    let beatsPerMeasure = getBeatsPerMeasure(measureSettings.numerator);

    if (measureSettings.skipping.skippingEnabled) {
        let measureCount = measureSettings.skipping.measuresOn + measureSettings.skipping.measuresOff;
        return measureCount * beatsPerMeasure;
    } else {
        return beatsPerMeasure;
    }
}

export function getBeatsPerMeasure(numerator, denominator) {
    // Compound time signatures
    /*
    if (denominator === 8 && numerator % 3 === 0 && numerator >= 6) {
        return numerator / 3;
    }*/

    // Simple signatures - return numerator
    return numerator;
}

export function getSubdivisionValue(denominator) {
    if (denominator === 4) return "4n";  // Quarter-note subdivision
    if (denominator === 8) return "8n";  // Eighth-note subdivision
    if (denominator === 16) return "16n"; // Sixteenth-note subdivision
    return "4n"; // Default to quarter notes
}


export function shouldPlayBeat(beatCount, measureSettings) {
    // Check whether skipping is enabled
    if (!measureSettings.skipping.skippingEnabled) {
        return true;
    }

    let cycleLength = getCycleLength(measureSettings);
    let relativeBeat = beatCount % cycleLength;
    return relativeBeat < (measureSettings.skipping.measuresOn * getBeatsPerMeasure(measureSettings.numerator));
}


/* Settings updating */

export function shouldUpdateSettings(beatCount, localMeasureSettings, measureSettingsRef) {
    console.log("beatCount:", beatCount + 1);
    // Check for settings changes, skip if none
    if (JSON.stringify(localMeasureSettings) === JSON.stringify(measureSettingsRef.current)) return;

    let flags = new Set();

    /*
        List of flags:
            FIRST_BEAT

            SKIPPING_ON
            SKIPPING_OFF
            SKIPPING_CHANGED
            SKIPPING_ENABLED
            SKIPPING_DISABLED

            IN_ON_MEASURES
            IN_OFF_MEASURES
            START_OF_MEASURE

            MEASURES_ON_INCREASED
            MEASURES_ON_DECREASED

            NUMERATOR_INCREASED
            NUMERATOR_DECREASED
    */

    // Current skipping setting
    if (localMeasureSettings.skipping.skippingEnabled == measureSettingsRef.current.skipping.skippingEnabled) {
        if (localMeasureSettings.skipping.skippingEnabled) 
            flags.add("SKIPPING_ON");
        else 
            flags.add("SKIPPING_OFF");
    }

    // Changes to skipping
    if (localMeasureSettings.skipping.skippingEnabled != measureSettingsRef.current.skipping.skippingEnabled) {
        // Skipping updated
        flags.add("SKIPPING_UPDATED");
        // Get update
        if (measureSettingsRef.current.skipping.skippingEnabled) 
            flags.add("SKIPPING_ENABLED");
        else 
            flags.add("SKIPPING_DISABLED");
    }

    // Beat location
    if (beatCount < getBeatsOn(localMeasureSettings)) 
        flags.add("IN_ON_MEASURES");
    else 
        flags.add("IN_OFF_MEASURES");
    if (beatCount == 0) 
        flags.add("FIRST_BEAT");
    if (beatCount % getBeatsPerMeasure(localMeasureSettings.numerator, measureSettingsRef.current.numerator) == 0) 
        flags.add("START_OF_MEASURE");

    // Measure skipping changes
    if (localMeasureSettings.skipping.measuresOn < measureSettingsRef.current.skipping.measuresOn)
        flags.add("MEASURES_ON_INCREASED");
    else if (localMeasureSettings.skipping.measuresOn > measureSettingsRef.current.skipping.measuresOn)
        flags.add("MEASURES_ON_DECREASED");

    // Time signature changes
    if (localMeasureSettings.numerator < measureSettingsRef.current.numerator)
        flags.add("NUMERATOR_INCREASED");
    else if (localMeasureSettings.numerator > measureSettingsRef.current.numerator)
        flags.add("NUMERATOR_DECREASED");

    // Dispatch flags
    return evaluateMeasureChanges(flags);
}
