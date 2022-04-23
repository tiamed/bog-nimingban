import { atom } from "jotai";

import { atomWithAsyncStorage } from "./lib";

import { Post } from "@/api";

export const emoticonIndexAtom = atomWithAsyncStorage("emoticonIndex", 0);

export const currentPostAtom = atom({} as Post);

export const tabRefreshingAtom = atom(false);

export const showHomeActionModalAtom = atom(false);

export const showColorPickerModalAtom = atom(false);

export const postIdRefreshingAtom = atom(-1);

export const historyTabAtom = atomWithAsyncStorage("historyTab", 0);
