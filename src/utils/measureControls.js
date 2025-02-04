
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