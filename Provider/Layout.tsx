import { useAtom } from "jotai";
import { createContext } from "react";

import {
  accurateTimeFormatAtom,
  anonCookieModeAtom,
  anonCookieTextAtom,
  emojiCookieModeAtom,
  emoticonPickerHeightAtom,
  fontFamilyAtom,
  groupSearchResultsAtom,
  sizeAtom,
  threadReplyReverseAtom,
} from "@/atoms";

export const SizeContext = createContext(14);
export const LayoutConfigContext = createContext({
  accurateTimeFormat: false,
  fontFamily: undefined,
  groupSearchResults: false,
  threadReplyReverse: false,
  emojiCookieMode: false,
  anonCookieMode: false,
  anonCookieText: "",
  emoticonPickerHeight: 200,
});

export const ThreadPostConfigContext = createContext({
  expandable: true,
  clickable: true,
});

export default function LayoutProvider(props: any) {
  const [size] = useAtom(sizeAtom);
  const [accurate] = useAtom(accurateTimeFormatAtom);
  const [fontFamily] = useAtom(fontFamilyAtom);
  const [threadReplyReverse] = useAtom(threadReplyReverseAtom);
  const [groupSearchResults] = useAtom(groupSearchResultsAtom);
  const [emojiCookieMode] = useAtom(emojiCookieModeAtom);
  const [anonCookieMode] = useAtom(anonCookieModeAtom);
  const [anonCookieText] = useAtom(anonCookieTextAtom);
  const [emoticonPickerHeight] = useAtom(emoticonPickerHeightAtom);

  return (
    <LayoutConfigContext.Provider
      value={{
        accurateTimeFormat: accurate,
        fontFamily,
        groupSearchResults,
        threadReplyReverse,
        emojiCookieMode,
        anonCookieMode,
        anonCookieText,
        emoticonPickerHeight,
      }}>
      <SizeContext.Provider value={size}>{props.children}</SizeContext.Provider>
    </LayoutConfigContext.Provider>
  );
}
