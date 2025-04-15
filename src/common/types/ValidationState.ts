export type ValidationState = {
    state: "PENDING" | "BEFORE" | "VALID" ;
}|{
    state:"ERROR",
    errorText:string
}