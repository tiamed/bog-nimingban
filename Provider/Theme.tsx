import Color from "color";
import { useAtom } from "jotai";
import { createContext } from "react";

import {
  backgroundColorDarkAtom,
  backgroundColorLightAtom,
  cardColorDarkAtom,
  cardColorLightAtom,
  highlightColorAtom,
  textColorAlphaAtom,
  tintColorAtom,
} from "@/atoms";
import { getContrastColor, getFirstContrastColor } from "@/components/Themed";
import Colors from "@/constants/Colors";
import useColorScheme from "@/hooks/useColorScheme";

export const ColorSchemeContext = createContext("light");
export const TintContext = createContext("#FC88B3");
export const HighlightContext = createContext("#FC4C5D");
export const TextColorAlphaContext = createContext(1);
export const BackgroundColorContext = createContext({ light: "#fff", dark: "#000" });
export const ComputedColorContext = createContext({
  light: {
    highlightBackground: Colors.light.highlightBackground,
    tintBackground: Colors.light.tintBackground,
    border: Colors.light.border,
    replyBackground: Colors.light.replyBackground,
    quoteBackground: Colors.light.quoteBackground,
    quoteReference: Colors.light.quoteReference,
  },
  dark: {
    highlightBackground: Colors.dark.highlightBackground,
    tintBackground: Colors.dark.tintBackground,
    border: Colors.dark.border,
    replyBackground: Colors.dark.replyBackground,
    quoteBackground: Colors.dark.quoteBackground,
    quoteReference: Colors.dark.quoteReference,
  },
});

export default function ThemeProvider(props: any) {
  const colorScheme = useColorScheme();
  const [tint] = useAtom(tintColorAtom);
  const [highlight] = useAtom(highlightColorAtom);
  const [textColorAlpha] = useAtom(textColorAlphaAtom);
  const [backgroundColorLight] = useAtom(backgroundColorLightAtom);
  const [backgroundColorDark] = useAtom(backgroundColorDarkAtom);
  const [cardColorLight] = useAtom(cardColorLightAtom);
  const [cardColorDark] = useAtom(cardColorDarkAtom);
  const computedColor = {
    light: {
      highlightBackground: Color(highlight).alpha(0.1).string(),
      tintBackground: Color(tint).alpha(0.1).string(),
      border: Color(backgroundColorLight).mix(Color("black"), 0.1).string(),
      replyBackground: Color(backgroundColorLight).mix(Color("black"), 0.02).string(),
      quoteBackground: Color(backgroundColorLight).mix(Color("black"), 0.04).string(),
      quoteReference: Color(backgroundColorLight).mix(Color("black"), 0.1).string(),
      cardActive: getFirstContrastColor([tint, "#fff", "#000"], cardColorLight),
      cardInactive: getContrastColor([Colors.light.inactive, Colors.dark.inactive], cardColorLight),
    },
    dark: {
      highlightBackground: Color(highlight).alpha(0.1).string(),
      tintBackground: Color(tint).alpha(0.1).string(),
      border: Color(backgroundColorDark).mix(Color("white"), 0.2).string(),
      replyBackground: Color(backgroundColorDark).mix(Color("white"), 0.1).string(),
      quoteBackground: Color(backgroundColorDark).mix(Color("white"), 0.2).string(),
      quoteReference: Color(backgroundColorDark).mix(Color("white"), 0.9).string(),
      cardActive: getFirstContrastColor([tint, "#fff", "#000"], cardColorDark),
      cardInactive: getContrastColor([Colors.light.inactive, Colors.dark.inactive], cardColorDark),
    },
  };

  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      <TintContext.Provider value={tint}>
        <HighlightContext.Provider value={highlight}>
          <TextColorAlphaContext.Provider value={textColorAlpha}>
            <BackgroundColorContext.Provider
              value={{ light: backgroundColorLight, dark: backgroundColorDark }}>
              <ComputedColorContext.Provider value={computedColor}>
                {props.children}
              </ComputedColorContext.Provider>
            </BackgroundColorContext.Provider>
          </TextColorAlphaContext.Provider>
        </HighlightContext.Provider>
      </TintContext.Provider>
    </ColorSchemeContext.Provider>
  );
}
