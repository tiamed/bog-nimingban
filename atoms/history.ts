import { atomWithAsyncStorageChunked } from "./lib";

export const historyAtom = atomWithAsyncStorageChunked("history", [], true);

export const replyHistoryAtom = atomWithAsyncStorageChunked("replyHistory", []);
