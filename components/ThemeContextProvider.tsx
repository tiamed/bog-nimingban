import { useAtom } from "jotai";
import { createContext } from "react";

import { highlightColorAtom, tintColorAtom } from "@/atoms";
import useColorScheme from "@/hooks/useColorScheme";
import useSize from "@/hooks/useSize";

export const ColorSchemeContext = createContext("light");
export const SizeContext = createContext(16);
export const TintContext = createContext("#FC88B3");
export const HighlightContext = createContext("#FC4C5D");

export function ColorSchemeProvider(props: any) {
  const colorScheme = useColorScheme();
  const size = useSize();
  const [tint] = useAtom(tintColorAtom);
  const [highlight] = useAtom(highlightColorAtom);

  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      <SizeContext.Provider value={size}>
        <TintContext.Provider value={tint}>
          <HighlightContext.Provider value={highlight}>{props.children}</HighlightContext.Provider>
        </TintContext.Provider>
      </SizeContext.Provider>
    </ColorSchemeContext.Provider>
  );
}

export const ThemeContextConsumer = ColorSchemeContext.Consumer;
export const ThemeContextProvider = ColorSchemeContext;
