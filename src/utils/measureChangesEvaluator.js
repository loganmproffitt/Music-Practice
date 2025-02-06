
export function evaluateFlags(flags) {
    /*
        ACTIONS
            ENABLE SKIPPING
                UPDATE
            DISABLE SKIPPING
                IN_ON_MEASURES
                    UPDATE
                WAIT

            INCREASE_MEASURES_ON
                SKIPPING_OFF
                    UPDATE
                IN_ON_MEASURES
                    UPDATE
                WAIT
            DECREASE_MEASURES_ON
                WAIT (for now, can add flag for early enough)

            NUMERATOR_INCREASED
                SKIPPING_OFF
                    UPDATE
                IN_ON_MEASURES
                    UPDATE
                WAIT
            NUMERATOR_DECREASED
                WAIT    
    */

    let shouldUpdate = false;

    console.log("Flags: ", flags);

    // FIRST BEAT
    if (flags.has("FIRST_BEAT"))
        return true;

    // Enable skipping
    if (flags.has("SKIPPING_ENABLED")) {
        return true;
    }
    // Disable skipping
    else if (flags.has("SKIPPING_DISABLED")) {
        if (flags.has("IN_ON_MEASURES"))
            return true;
        else
            return false;
    }

    // MEASURES CHANGES
    if (flags.has("MEASURES_ON_INCREASED")) {
        // Skipping off
        if (flags.has("SKIPPING_OFF"))
            return true;
        // In on measures?
        else if (flags.has("IN_ON_MEASURES"))
            return true;
        else
            return false;
    }
    // Measures on decreased
    else if (flags.has("MEASURES_ON_DECREASED")) {
        // TODO: Should this check if beat is before the decrease point?
        return false;
    }

    // Measures off change
    if (flags.has("MEASURES_OFF_INCREASED") || flags.has("MEASURES_OFF_DECREASED")) {
        // If in on measure, update
        if (flags.has("IN_ON_MEASURES"))
            return true;
        else
            return false;
    }
    
    // NUMERATOR CHANGES
    if (flags.has("NUMERATOR_INCREASED")) {
        if (flags.has("SKIPPING_OFF"))
            return true;
        else if (flags.has("IN_ON_MEASURES"))
            return true;
        else
            return false;
    }
    else if (flags.has("NUMERATOR_DECREASED"))
        return false;


    return shouldUpdate;
}