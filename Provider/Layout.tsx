import { useAtom } from "jotai";
import { createContext } from "react";

import {
  accurateTimeFormatAtom,
  fontFamilyAtom,
  groupSearchResultsAtom,
  sizeAtom,
  threadReplyReverseAtom,
} from "@/atoms";

export const SizeContext = createContext(14);
export const AccurateTimeFormatContext = createContext(false);
export const FontFamilyContext = createContext(undefined);
export const ThreadReplyReverseContext = createContext(false);
export const GroupSearchResultContext = createContext(false);

export default function LayoutProvider(props: any) {
  const [size] = useAtom(sizeAtom);
  const [accurate] = useAtom(accurateTimeFormatAtom);
  const [fontFamily] = useAtom(fontFamilyAtom);
  const [threadReplyReverse] = useAtom(threadReplyReverseAtom);
  const [groupSearchResults] = useAtom(groupSearchResultsAtom);

  return (
    <GroupSearchResultContext.Provider value={groupSearchResults}>
      <ThreadReplyReverseContext.Provider value={threadReplyReverse}>
        <FontFamilyContext.Provider value={fontFamily}>
          <AccurateTimeFormatContext.Provider value={accurate}>
            <SizeContext.Provider value={size}>{props.children}</SizeContext.Provider>
          </AccurateTimeFormatContext.Provider>
        </FontFamilyContext.Provider>
      </ThreadReplyReverseContext.Provider>
    </GroupSearchResultContext.Provider>
  );
}
