import Color from "color";
import { useContext } from "react";

import { HighlightContext, TintContext, TextColorAlphaContext } from "@/Provider";
import Colors from "@/constants/Colors";

export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export default function useColor() {
  const color = useContext<string>(TintContext);
  const highlight = useContext<string>(HighlightContext);
  const textColorAlpha = useContext<number>(TextColorAlphaContext);
  const dynamicColorNames: ColorName[] = ["button", "active", "tabIconSelected", "tint"];
  const light = Colors.light;
  const dark = Colors.dark;
  dynamicColorNames.forEach((name) => {
    light[name] = color;
    dark[name] = color;
  });
  light.highlight = highlight;
  dark.highlight = highlight;
  light.text = `rgba(0,0,0,${textColorAlpha})`;
  dark.text = `rgba(255,255,255,${textColorAlpha})`;
  light.highlightBackground = Color(highlight).alpha(0.1).string();
  dark.highlightBackground = Color(highlight).alpha(0.1).string();
  light.tintBackground = Color(color).alpha(0.1).string();
  dark.tintBackground = Color(color).alpha(0.1).string();
  return {
    light,
    dark,
  };
}
