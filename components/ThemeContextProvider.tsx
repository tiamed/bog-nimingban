import { useAtom } from "jotai";
import { createContext } from "react";

import {
  accurateTimeFormatAtom,
  fontFamilyAtom,
  highlightColorAtom,
  sizeAtom,
  threadReplyReverseAtom,
  tintColorAtom,
} from "@/atoms";
import useColorScheme from "@/hooks/useColorScheme";

export const ColorSchemeContext = createContext("light");
export const SizeContext = createContext(14);
export const TintContext = createContext("#FC88B3");
export const HighlightContext = createContext("#FC4C5D");
export const AccurateTimeFormatContext = createContext(false);
export const FontFamilyContext = createContext(undefined);
export const ThreadReplyReverseContext = createContext(false);

export function ColorSchemeProvider(props: any) {
  const colorScheme = useColorScheme();
  const [size] = useAtom(sizeAtom);
  const [tint] = useAtom(tintColorAtom);
  const [highlight] = useAtom(highlightColorAtom);
  const [accurate] = useAtom(accurateTimeFormatAtom);
  const [fontFamily] = useAtom(fontFamilyAtom);
  const [threadReplyReverse] = useAtom(threadReplyReverseAtom);

  return (
    <ThreadReplyReverseContext.Provider value={threadReplyReverse}>
      <FontFamilyContext.Provider value={fontFamily}>
        <AccurateTimeFormatContext.Provider value={accurate}>
          <ColorSchemeContext.Provider value={colorScheme}>
            <SizeContext.Provider value={size}>
              <TintContext.Provider value={tint}>
                <HighlightContext.Provider value={highlight}>
                  {props.children}
                </HighlightContext.Provider>
              </TintContext.Provider>
            </SizeContext.Provider>
          </ColorSchemeContext.Provider>
        </AccurateTimeFormatContext.Provider>
      </FontFamilyContext.Provider>
    </ThreadReplyReverseContext.Provider>
  );
}

export const ThemeContextConsumer = ColorSchemeContext.Consumer;
export const ThemeContextProvider = ColorSchemeContext;
