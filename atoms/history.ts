import { atomWithAsyncStorage } from "./lib";

export const historyAtom = atomWithAsyncStorage("history", [], true);

export const replyHistoryAtom = atomWithAsyncStorage("replyHistory", []);
