import { atomWithAsyncStorageChunked, atomWithAsyncStorage } from "./lib";

export const historyAtom = atomWithAsyncStorageChunked("history", [], true);

export const replyHistoryAtom = atomWithAsyncStorageChunked("replyHistory", []);

export const searchHistoryAtom = atomWithAsyncStorage("searchHistory", []);
