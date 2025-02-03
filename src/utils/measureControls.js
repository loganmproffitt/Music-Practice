
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

export function getBeatsPerMeasure(numerator) {
    if (numerator % 3 === 0 && numerator >= 6) {
        return numerator / 3; 
    }
    return numerator;
}

export function shouldPlayBeat(beatCount, measureSettings) {
    // Check whether skipping is enabled
    if (measureSettings.skippingEnabled) {
        let beatsPerMeasure = getBeatsPerMeasure(measureSettings.numerator);

        let cycleLength = (measureSettings.skipping.measuresOn + measureSettings.skipping.measuresOff) * beatsPerMeasure;
        let relativeBeat = beatCount % cycleLength;

        return relativeBeat > (measureSettings.skipping.measuresOn * beatsPerMeasure);
    } else {
        return true;
    }
}