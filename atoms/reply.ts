import { atom } from "jotai";

import { atomWithAsyncStorage } from "./lib";

export const draftAtom = atom("");

export const selectionAtom = atom({ start: 0, end: 0 });

export const sketchUriAtom = atomWithAsyncStorage("sketchUri", "");

export const selectedCookieAtom = atomWithAsyncStorage("selectedCookie", null);
