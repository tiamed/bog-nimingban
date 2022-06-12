import { atomWithAsyncStorage } from "./lib";

export const colorSchemeAtom = atomWithAsyncStorage("colorScheme", null);

export const tintColorAtom = atomWithAsyncStorage("tintColor", "#ff7096");

export const highlightColorAtom = atomWithAsyncStorage("highlightColor", "#ff4d6d");

export const textColorAlphaAtom = atomWithAsyncStorage("textColorAlpha", 1);

export const backgroundColorLightAtom = atomWithAsyncStorage("backgroundColorLight", "#fff");

export const backgroundColorDarkAtom = atomWithAsyncStorage("backgroundColorDark", "#000");

export const cardColorLightAtom = atomWithAsyncStorage("cardColorLight", "#121212");

export const cardColorDarkAtom = atomWithAsyncStorage("cardColorDark", "#000");
