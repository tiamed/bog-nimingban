import { atom } from "jotai";
import { PixelRatio } from "react-native";

import { atomWithAsyncStorage } from "./lib";

import Layout from "@/constants/Layout";

export const sizeAtom = atomWithAsyncStorage("baseSize", 14);

export const lineHeightTimesAtom = atomWithAsyncStorage("lineHeight", 1.4);

export const lineHeightAtom = atom<number>(
  (get) => PixelRatio.roundToNearestPixel(get(sizeAtom) * get(lineHeightTimesAtom)) || 0
);
export const maxLineAtom = atomWithAsyncStorage("maxLine", 10);

export const expandableAtom = atom<boolean>((get) => get(maxLineAtom) === 999);

export const threadDirectionAtom = atomWithAsyncStorage("threadDirection", "row");

export const thumbnailResizeAtom = atomWithAsyncStorage("thumbnailResize", "contain");

export const imageWidthAtom = atomWithAsyncStorage("imageWidth", "49%");

export const accurateTimeFormatAtom = atomWithAsyncStorage("accurateTimeFormat", false);

export const footerLayoutAtom = atomWithAsyncStorage("footerLayout", [
  "收藏",
  "分享",
  "回复",
  "跳页",
]);

export const fontFamilyAtom = atomWithAsyncStorage("fontFamily", null);

export const showTabBarLabelAtom = atomWithAsyncStorage("showTabBarLabel", true);

export const showThreadReplyAtom = atomWithAsyncStorage("showThreadReply", false);

export const threadReplyReverseAtom = atomWithAsyncStorage("threadReplyReverse", false);

export const groupSearchResultsAtom = atomWithAsyncStorage("groupSearchResults", false);

export const fullscreenInputAtom = atomWithAsyncStorage("fullscreenInput", false);

export const orderAtom = atomWithAsyncStorage("order", 0);

export const postFilteredAtom = atom(false);

export const bottomGapAtom = atomWithAsyncStorage("bottomGap", 1);

export const postFilteredRecordsAtom = atomWithAsyncStorage("postFilteredRecords", []);

export const shouldMemorizePostFilteredAtom = atomWithAsyncStorage(
  "shouldMemorizePostFiltered",
  false
);

export const clickableAtom = atomWithAsyncStorage("clickable", true);

export const emoticonPickerHeightAtom = atomWithAsyncStorage("emoticonPickerHeight", 200);

export const responsiveWidthAtom = atom(Layout.window.width);

export const anonCookieModeAtom = atomWithAsyncStorage("anonCookieMode", false);
