import { evaluateFlags } from "./measureChangesEvaluator.js";

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
    return numerator;
}

export function getSubdivisionValue(denominator) {
    if (denominator === 4) return "4n";  // Quarter-note subdivision
    if (denominator === 8) return "8n";  // Eighth-note subdivision
    if (denominator === 16) return "16n"; // Sixteenth-note subdivision
    return "4n"; // Default to quarter notes
}


export function shouldPlayBeat(measureBeat, cycleBeat, measureSettings) {
    // Check whether skipping is enabled
    if (measureSettings.skipping.skippingEnabled) {
        // In off measures?
        if (cycleBeat >= (measureSettings.skipping.measuresOn * getBeatsPerMeasure(measureSettings.numerator)))
            return false;     
    }

    return measureSettings.mask[measureBeat];
}


/* Settings updating */

export function shouldUpdateSettings(beatCount, localMeasureSettings, measureSettingsRef) {
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

            MASK_UPDATED
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

    if (localMeasureSettings.skipping.measuresOff < measureSettingsRef.current.skipping.measuresOff)
        flags.add("MEASURES_OFF_INCREASED");
    else if (localMeasureSettings.skipping.measuresOff > measureSettingsRef.current.skipping.measuresOff)
        flags.add("MEASURES_OFF_DECREASED");

    // Time signature changes
    if (localMeasureSettings.numerator < measureSettingsRef.current.numerator)
        flags.add("NUMERATOR_INCREASED");
    else if (localMeasureSettings.numerator > measureSettingsRef.current.numerator)
        flags.add("NUMERATOR_DECREASED");

    // Mask changes - always update
    if (localMeasureSettings.mask != measureSettingsRef.current.mask)
        flags.add("MASK_UPDATED");

    // Dispatch flags
    return evaluateFlags(flags);
}
