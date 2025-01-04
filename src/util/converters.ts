import {PropertyDeclaration} from "@lit/reactive-element";

export const booleanConverter: PropertyDeclaration["converter"] = {
    fromAttribute: (value) => !!(value && value !== "false"),
    toAttribute: (value) => (value ? "true" : "false"),
}