import { AtAiId } from "./ids";

export const AtAiCapabilities = {
    BPMS: {
        FORMAKER: {
            FORM_GENERATE: AtAiId.makeCapability({
                app: "bpms",
                area: "formmaker",
                target: "form",
                action: "generate",
            }),
        },
        APIMANAGER: {
            POST_RESPONSE_SCRIPT_GENERATE: AtAiId.makeCapability({
                app: "bpms",
                area: "apimanager",
                target: "post_response_script",
                action: "generate",
            }),
        },
    },
} as const;
