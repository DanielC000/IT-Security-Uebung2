import { Session } from "./session";

export type PartialSession = Omit<Session, "issued" | "expires">;