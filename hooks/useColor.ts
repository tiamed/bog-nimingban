import { useContext } from "react";

import {
  HighlightContext,
  TintContext,
  TextColorAlphaContext,
  BackgroundColorContext,
  ComputedColorContext,
} from "@/Provider";
import Colors from "@/constants/Colors";

export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export type ComputedColor = Record<"light" | "dark", Partial<Record<ColorName, string>>>;

export default function useColor() {
  const color = useContext<string>(TintContext);
  const highlight = useContext<string>(HighlightContext);
  const textColorAlpha = useContext<number>(TextColorAlphaContext);
  const backgroundColor = useContext(BackgroundColorContext);
  const computedColor = useContext<ComputedColor>(ComputedColorContext as any);
  const tintColorNames: ColorName[] = ["button", "active", "tabIconSelected", "tint"];
  const light = Colors.light;
  const dark = Colors.dark;
  tintColorNames.forEach((name) => {
    light[name] = color;
    dark[name] = color;
  });
  light.highlight = highlight;
  dark.highlight = highlight;
  light.background = backgroundColor.light;
  dark.background = backgroundColor.dark;

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
