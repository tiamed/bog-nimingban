import { useAtom } from "jotai";
import { createContext } from "react";

import { highlightColorAtom, tintColorAtom } from "@/atoms";
import useColorScheme from "@/hooks/useColorScheme";

export const ColorSchemeContext = createContext("light");
export const TintContext = createContext("#FC88B3");
export const HighlightContext = createContext("#FC4C5D");

export default function ThemeProvider(props: any) {
  const colorScheme = useColorScheme();
  const [tint] = useAtom(tintColorAtom);
  const [highlight] = useAtom(highlightColorAtom);

  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      <TintContext.Provider value={tint}>
        <HighlightContext.Provider value={highlight}>{props.children}</HighlightContext.Provider>
      </TintContext.Provider>
    </ColorSchemeContext.Provider>
  );
}
