import { atomWithAsyncStorage } from "./lib";

export const blackListPostsAtom = atomWithAsyncStorage("blackListPosts", []);

export const blackListForumsAtom = atomWithAsyncStorage("blackListForums", []);

export const canCheckUpdateAtom = atomWithAsyncStorage("canCheckUpdate", false);

export const vibrateAtom = atomWithAsyncStorage("vibrate", true);

export const noImageModeAtom = atomWithAsyncStorage("noImageMode", "off");
