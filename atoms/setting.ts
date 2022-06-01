import { atomWithAsyncStorage } from "./lib";

export const blackListPostsAtom = atomWithAsyncStorage("blackListPosts", []);

export const blackListCookiesAtom = atomWithAsyncStorage("blackListCookies", []);

export const blackListForumsAtom = atomWithAsyncStorage("blackListForums", []);

export const blackListWordsAtom = atomWithAsyncStorage("blackListWords", []);

export const canCheckUpdateAtom = atomWithAsyncStorage("canCheckUpdate", false);

export const vibrateAtom = atomWithAsyncStorage("vibrate", true);

export const noImageModeAtom = atomWithAsyncStorage("noImageMode", "off");

export const forumsOrderAtom = atomWithAsyncStorage("forumsOrder", []);

export const forumsVisibilityAtom = atomWithAsyncStorage("forumsVisibility", {});

export const loadingsUrlAtom = atomWithAsyncStorage("loadingsUrl", "");

export const checkUpdateIntervalAtom = atomWithAsyncStorage(
  "checkUpdateInterval",
  6 * 60 * 60 * 1000
);

export const lastCheckUpdateAtom = atomWithAsyncStorage("lastCheckUpdate", 0, true);
