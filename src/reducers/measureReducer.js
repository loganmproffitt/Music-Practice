import { useReducer } from "react";

function measureSettingsReducer(state, action) {
    // Check if we should evaluate the flags
    if (action.type === "UPDATE_FLAGS") {
        const flags = new Set(action.payload.flags);
        let shouldUpdate = false;

        // Evaluate flags
        

        return { shouldUpdate, flags };
    }
    return state;
}