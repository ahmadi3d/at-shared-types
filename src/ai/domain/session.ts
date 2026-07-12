/** A single role message in a prompt (system, user, assistant, etc.) */
export interface AiPromptRoleDto {
    /** Role type: system | user | assistant */
    role: "system" | "user" | "assistant";

    /**
     * Content of the message.
     * Can include placeholders like {{var:name}} or {{prompt:other.prompt.id}}.
     */
    content: string;
}

export interface AiSessionConfigDto {
    id: string,
    messages?: AiPromptRoleDto[]
    priority?: number;
    // Slots act like namespaces: using one enforces exclusivity; without one, the config is additive.
    slot?: string;
}