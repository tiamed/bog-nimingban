import { useAtom } from "jotai";
import { createContext } from "react";

import {
  accurateTimeFormatAtom,
  anonCookieModeAtom,
  anonCookieTextAtom,
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
  anonCookieMode: false,
  anonCookieText: "",
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
  const [anonCookieMode] = useAtom(anonCookieModeAtom);
  const [anonCookieText] = useAtom(anonCookieTextAtom);

  return (
    <LayoutConfigContext.Provider
      value={{
        accurateTimeFormat: accurate,
        fontFamily,
        groupSearchResults,
        threadReplyReverse,
        anonCookieMode,
        anonCookieText,
      }}>
      <SizeContext.Provider value={size}>{props.children}</SizeContext.Provider>
    </LayoutConfigContext.Provider>
  );
}
