import {  AIIntentDTO } from "../engine";
import { AIChatResponseDTO } from "./chatResponseDTO";

export interface AIChatWithIntentResponseDTO extends AIChatResponseDTO {
    intents?: AIIntentDTO[];
}