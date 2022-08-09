import { atom } from "jotai";

import { atomWithAsyncStorage } from "./lib";

export const draftAtom = atom("");

export const canRecoverDraftAtom = atom(true);

export const autoSavedDraftAtom = atomWithAsyncStorage("autoSavedDraft", "");

export const sketchUriAtom = atomWithAsyncStorage("sketchUri", "");

export const selectedCookieAtom = atomWithAsyncStorage("selectedCookie", null);
