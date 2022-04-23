import { atomWithAsyncStorage } from "./lib";

export const colorSchemeAtom = atomWithAsyncStorage("colorScheme", null);

export const tintColorAtom = atomWithAsyncStorage("tintColor", "#ff7096");

export const highlightColorAtom = atomWithAsyncStorage("highlightColor", "#ff4d6d");
