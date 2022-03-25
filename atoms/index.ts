import AsyncStorage from "@react-native-async-storage/async-storage";

import { atom } from "jotai";

import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";

import { Forum } from "../api";

export const previewsAtom = atom<IImageInfo[]>([]);

export const previewIndexAtom = atom(0);

export const atomWithAsyncStorage = (
  key: string,
  initialValue: any,
  lateInit = false,
  expiresIn = 0
) => {
  const baseAtom = lateInit ? atom(null) : atom(initialValue);
  baseAtom.onMount = (setValue: (arg0: any) => void) => {
    (async () => {
      const item = await AsyncStorage.getItem(key);
      const lastModify = await AsyncStorage.getItem(`${key}_lastModify`);
      const notExpired =
        !expiresIn || Date.now() - Number(lastModify) < expiresIn;
      if (item && notExpired) {
        setValue(JSON.parse(item));
      } else {
        setValue(initialValue);
      }
    })();
  };
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      AsyncStorage.setItem(key, JSON.stringify(nextValue));
      AsyncStorage.setItem(`${key}_lastModify`, Date.now().toString());
    }
  );
  return derivedAtom;
};

export const forumsAtom = atomWithAsyncStorage(
  "forums",
  [],
  true,
  1000 * 60 * 60 * 6
); // 6 hours

export const forumsIdMapAtom = atom<Map<number, string>>(
  (get) => new Map(get(forumsAtom)?.map((item: Forum) => [item.id, item.name]))
);

export const emoticonsAtom = atomWithAsyncStorage(
  "emoticons",
  [],
  true,
  1000 * 60 * 60 * 6
);

export const threadAtom = atomWithAsyncStorage("thread", 0, true);

export const favoriteAtom = atomWithAsyncStorage("favorite", []);

export const historyAtom = atomWithAsyncStorage("history", [], true);

export const cookiesAtom = atomWithAsyncStorage("cookies", []);

export const tabRefreshingAtom = atom(false);

export const draftAtom = atom("");

export const signDictAtom = atomWithAsyncStorage("signDict", {}, true);
