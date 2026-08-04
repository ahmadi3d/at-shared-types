export type AtJsonPrimitive =
    | string
    | number
    | boolean
    | null;

export type AtJsonValue =
    | AtJsonPrimitive
    | AtJsonObject
    | AtJsonValue[];

export type AtJsonObject = {
    [key: string]: AtJsonValue;
};