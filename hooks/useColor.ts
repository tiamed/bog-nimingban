import { useContext } from "react";

import { ThemeContext, ComputedColorContext } from "@/Provider";
import Colors from "@/constants/Colors";

export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export type ComputedColor = Record<"light" | "dark", Partial<Record<ColorName, string>>>;

export default function useColor() {
  const { tintColor, highlightColor, textColorAlpha, backgroundColorDark, backgroundColorLight } =
    useContext(ThemeContext);
  const computedColor = useContext<ComputedColor>(ComputedColorContext as any);
  const tintColorNames: ColorName[] = ["button", "active", "tabIconSelected", "tint"];
  const light = Colors.light;
  const dark = Colors.dark;
  tintColorNames.forEach((name) => {
    light[name] = tintColor;
    dark[name] = tintColor;
  });
  light.highlight = highlightColor;
  dark.highlight = highlightColor;
  light.background = backgroundColorLight;
  dark.background = backgroundColorDark;

  // 字体颜色带上亮度
  light.text = `rgba(0,0,0,${textColorAlpha})`;
  dark.text = `rgba(255,255,255,${textColorAlpha})`;

  (Object.keys(computedColor.light) as ColorName[]).forEach((key) => {
    light[key] = computedColor.light[key]!;
  });
  (Object.keys(computedColor.dark) as ColorName[]).forEach((key) => {
    dark[key] = computedColor.dark[key]!;
  });

  return {
    light,
    dark,
  };
}
