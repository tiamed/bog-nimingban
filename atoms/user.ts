import { atomWithAsyncStorage } from "./lib";

export const searchForumFilterAtom = atomWithAsyncStorage("searchForumFilter", []);

export const cookiesAtom = atomWithAsyncStorage("cookies", []);

export const signDictAtom = atomWithAsyncStorage("signDict", {}, true);
