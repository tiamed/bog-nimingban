import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";

import { Forum, Post } from "@/api";

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
      const notExpired = !expiresIn || Date.now() - Number(lastModify) < expiresIn;
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
      const nextValue = typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      AsyncStorage.setItem(key, JSON.stringify(nextValue));
      AsyncStorage.setItem(`${key}_lastModify`, Date.now().toString());
    }
  );
  return derivedAtom;
};

export const forumsAtom = atomWithAsyncStorage("forums", [], true, 1000 * 60 * 60 * 6); // 6 hours

export const forumsIdMapAtom = atom<Map<number, string>>(
  (get) => new Map(get(forumsAtom)?.map((item: Forum) => [item.id, item.name]))
);

export const emoticonsAtom = atomWithAsyncStorage("emoticons", [], true, 1000 * 60 * 60 * 6);

export const currentPostAtom = atom({} as Post);

export const threadAtom = atomWithAsyncStorage("thread", 0, true);

export const favoriteAtom = atomWithAsyncStorage("favorite", []);

export const favoriteTagsAtom = atomWithAsyncStorage("favoriteTags", []);

export const favoriteFilterAtom = atomWithAsyncStorage("favoriteFilter", "");

export const historyAtom = atomWithAsyncStorage("history", [], true);

export const replyHistoryAtom = atomWithAsyncStorage("replyHistory", []);

export const cookiesAtom = atomWithAsyncStorage("cookies", []);

export const tabRefreshingAtom = atom(false);

export const draftAtom = atom("");

export const selectionAtom = atom({ start: 0, end: 0 });

export const signDictAtom = atomWithAsyncStorage("signDict", {}, true);

export const showPageModalAtom = atom(false);

export const showActionModalAtom = atom(false);

export const showHomeActionModalAtom = atom(false);

export const showColorPickerModalAtom = atom(false);

export const sizeAtom = atomWithAsyncStorage("fontSize", "normal");

export const lineHeightAtom = atomWithAsyncStorage("lineHeight", 1.4);

export const maxLineAtom = atomWithAsyncStorage("maxLine", 10);

export const postIdRefreshingAtom = atom(-1);

export const postFilteredAtom = atom(false);

export const orderAtom = atomWithAsyncStorage("order", 0);

export const colorSchemeAtom = atomWithAsyncStorage("colorScheme", null);

export const threadDirectionAtom = atomWithAsyncStorage("threadDirection", "row");

export const thumbnailResizeAtom = atomWithAsyncStorage("thumbnailResize", "contain");

export const imageWidthAtom = atomWithAsyncStorage("imageWidth", "49%");

export const selectedCookieAtom = atomWithAsyncStorage("selectedCookie", null);

export const historyTabAtom = atomWithAsyncStorage("historyTab", 0);

export const blackListPostsAtom = atomWithAsyncStorage("blackListPosts", []);

export const tintColorAtom = atomWithAsyncStorage("tintColor", "#FC88B3");

export const highlightColorAtom = atomWithAsyncStorage("highlightColor", "#FD4C5D");

export const accurateTimeFormatAtom = atomWithAsyncStorage("accurateTimeFormat", false);

export const footerLayoutAtom = atomWithAsyncStorage("footerLayout", [
  "收藏",
  "分享",
  "回复",
  "跳页",
]);
