import { ATAIID } from "./ids";

export const ATAICapabilities = {
    BPMS: {
        FORMAKER: {
            FORM_GENERATE: ATAIID.makeCapability({
                app: "bpms",
                area: "formmaker",
                target: "form",
                action: "generate",
            }),
        },
        APIMANAGER: {
            POST_RESPONSE_SCRIPT_GENERATE: ATAIID.makeCapability({
                app: "bpms",
                area: "apimanager",
                target: "post_response_script",
                action: "generate",
            }),
        },
    },
} as const;
