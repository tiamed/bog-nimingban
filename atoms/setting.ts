import { atomWithAsyncStorage } from "./lib";

export const blackListPostsAtom = atomWithAsyncStorage("blackListPosts", []);

export const canCheckUpdateAtom = atomWithAsyncStorage("canCheckUpdate", false);
