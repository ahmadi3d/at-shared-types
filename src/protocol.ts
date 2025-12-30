export * from "./core/protocol/errors";

import { ATAPIErrorCodeMap } from "./core/protocol/errors";

export const ATProtocol = { ATAPIErrorCodeMap } as const;

export namespace ATProtocol {
    export type ATAPIErrorCode =
        import("./core/protocol/errors").ATAPIErrorCode;
}
