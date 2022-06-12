import { useAtom } from "jotai";
import { createContext } from "react";

import {
  backgroundColorDarkAtom,
  backgroundColorLightAtom,
  highlightColorAtom,
  textColorAlphaAtom,
  tintColorAtom,
} from "@/atoms";
import useColorScheme from "@/hooks/useColorScheme";

export const ColorSchemeContext = createContext("light");
export const TintContext = createContext("#FC88B3");
export const HighlightContext = createContext("#FC4C5D");
export const TextColorAlphaContext = createContext(1);
export const BackgroundColorContext = createContext({ light: "#fff", dark: "#000" });

export default function ThemeProvider(props: any) {
  const colorScheme = useColorScheme();
  const [tint] = useAtom(tintColorAtom);
  const [highlight] = useAtom(highlightColorAtom);
  const [textColorAlpha] = useAtom(textColorAlphaAtom);
  const [backgroundColorLight] = useAtom(backgroundColorLightAtom);
  const [backgroundColorDark] = useAtom(backgroundColorDarkAtom);

  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      <TintContext.Provider value={tint}>
        <HighlightContext.Provider value={highlight}>
          <TextColorAlphaContext.Provider value={textColorAlpha}>
            <BackgroundColorContext.Provider
              value={{ light: backgroundColorLight, dark: backgroundColorDark }}>
              {props.children}
            </BackgroundColorContext.Provider>
          </TextColorAlphaContext.Provider>
        </HighlightContext.Provider>
      </TintContext.Provider>
    </ColorSchemeContext.Provider>
  );
}
