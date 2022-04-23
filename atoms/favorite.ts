import { atomWithAsyncStorage } from "./lib";

export const threadAtom = atomWithAsyncStorage("thread", 0, true);

export const favoriteAtom = atomWithAsyncStorage("favorite", []);

export const favoriteTagsAtom = atomWithAsyncStorage("favoriteTags", []);

export const favoriteFilterAtom = atomWithAsyncStorage("favoriteFilter", "");
