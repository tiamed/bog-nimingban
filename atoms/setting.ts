import { atomWithAsyncStorage } from "./lib";

export const blackListPostsAtom = atomWithAsyncStorage("blackListPosts", []);

export const blackListCookiesAtom = atomWithAsyncStorage("blackListCookies", []);

export const blackListForumsAtom = atomWithAsyncStorage("blackListForums", []);

export const canCheckUpdateAtom = atomWithAsyncStorage("canCheckUpdate", false);

export const vibrateAtom = atomWithAsyncStorage("vibrate", true);

export const noImageModeAtom = atomWithAsyncStorage("noImageMode", "off");

export const forumsOrderAtom = atomWithAsyncStorage("forumsOrder", []);

export const forumsVisibilityAtom = atomWithAsyncStorage("forumsVisibility", {});

export const loadingsUrlAtom = atomWithAsyncStorage("loadingsUrl", "");
