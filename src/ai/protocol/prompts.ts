import { ATAIID } from "./ids";

export const ATAIPrompts = {
    BPMS: {
        SYSTEM: {
            INTENT_DETECTION_V1: ATAIID.makePrompt({
                app: "bpms",
                area: "system",
                target: "intent",
                action: "detection",
                v: 1
            }),
        },
        FORMAKER: {
            VALUE_GENERATE_V1: ATAIID.makePrompt({
                app: "bpms",
                area: "formmaker",
                target: "value",
                action: "generate",
                v: 1,
            }),
        },
        APIMANAGER: {
            POST_RESPONSE_SCRIPT_GENERATE_V1: ATAIID.makePrompt({
                app: "bpms",
                area: "apimanager",
                target: "post_response_script",
                action: "generate",
                v: 1,
            }),
        },
    },
} as const;
