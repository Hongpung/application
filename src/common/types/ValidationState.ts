export type ValidationState = {
    state: "PENDING" | "BEFORE" | "VALID" | "ERROR";
    errorText?: string;
}