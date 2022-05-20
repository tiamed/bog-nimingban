import { atom } from "jotai";

import { atomWithAsyncStorage } from "./lib";

import { Forum } from "@/api";
import Loadings from "@/constants/Loadings";

export const forumsAtom = atomWithAsyncStorage("forums", [], true);

export const forumsIdMapAtom = atom<Map<number, string>>(
  (get) => new Map(get(forumsAtom)?.map((item: Forum) => [item.id, item.name]))
);

export const emoticonsAtom = atomWithAsyncStorage("emoticons", [], true, 1000 * 60 * 60 * 24);

export const loadingsAtom = atomWithAsyncStorage("loadings", Loadings);
