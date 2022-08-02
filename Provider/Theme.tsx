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
import Colors from "@/constants/Colors";
import useColorScheme from "@/hooks/useColorScheme";
import { getContrastColor, getFirstContrastColor } from "@/utils/color";

export const ColorSchemeContext = createContext("light");
export const ThemeContext = createContext({
  tintColor: Colors.light.tint,
  highlightColor: Colors.light.highlight,
  backgroundColorLight: Colors.light.background,
  backgroundColorDark: Colors.dark.background,
  textColorAlpha: 1,
});

export const ComputedColorContext = createContext({
  light: {
    highlightBackground: Colors.light.highlightBackground,
    tintBackground: Colors.light.tintBackground,
    border: Colors.light.border,
    replyBackground: Colors.light.replyBackground,
    quoteBackground: Colors.light.quoteBackground,
    quoteReference: Colors.light.quoteReference,
    card: Colors.light.card,
  },
  dark: {
    highlightBackground: Colors.dark.highlightBackground,
    tintBackground: Colors.dark.tintBackground,
    border: Colors.dark.border,
    replyBackground: Colors.dark.replyBackground,
    quoteBackground: Colors.dark.quoteBackground,
    quoteReference: Colors.dark.quoteReference,
    card: Colors.dark.card,
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
      card: cardColorLight,
      cardText: getContrastColor(["#e5e5e7", "#1c1c1e"], cardColorLight),
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
      card: cardColorDark,
      cardText: getContrastColor(["#e5e5e7", "#1c1c1e"], cardColorDark),
      cardActive: getFirstContrastColor([tint, "#fff", "#000"], cardColorDark),
      cardInactive: getContrastColor([Colors.light.inactive, Colors.dark.inactive], cardColorDark),
    },
  };

  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      <ThemeContext.Provider
        value={{
          tintColor: tint,
          highlightColor: highlight,
          backgroundColorLight,
          backgroundColorDark,
          textColorAlpha,
        }}>
        <ComputedColorContext.Provider value={computedColor}>
          {props.children}
        </ComputedColorContext.Provider>
      </ThemeContext.Provider>
    </ColorSchemeContext.Provider>
  );
}
