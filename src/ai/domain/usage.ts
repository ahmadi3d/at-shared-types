/** Private owner-scoped ledger projection; no provider credentials, billing configuration or other users. */
export interface AiSelfUsageDto {
    contractVersion: 1;
    individualAllowance: "exempt" | "enforced";
    total: string | null;
    records: Array<{
        id: string;
        state: "reserved" | "in_flight" | "settled" | "released" | "ambiguous";
        estimatedMicroUsd: string | null;
        actualMicroUsd: string | null;
        inputTokens: string | null;
        outputTokens: string | null;
        createdAt: string;
    }>;
}
