import Color from "color";
import { useContext } from "react";

import {
  HighlightContext,
  TintContext,
  TextColorAlphaContext,
  BackgroundColorContext,
} from "@/Provider";
import Colors from "@/constants/Colors";

export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export default function useColor() {
  const color = useContext<string>(TintContext);
  const highlight = useContext<string>(HighlightContext);
  const textColorAlpha = useContext<number>(TextColorAlphaContext);
  const backgroundColor = useContext(BackgroundColorContext);
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

  // 根据主题色、强调色计算的色值
  light.highlightBackground = Color(highlight).alpha(0.1).string();
  dark.highlightBackground = Color(highlight).alpha(0.1).string();
  light.tintBackground = Color(color).alpha(0.1).string();
  dark.tintBackground = Color(color).alpha(0.1).string();

  // 根据背景色计算的色值
  light.border = Color(backgroundColor.light).mix(Color("black"), 0.1).string();
  dark.border = Color(backgroundColor.dark).mix(Color("white"), 0.2).string();
  light.replyBackground = Color(backgroundColor.light).mix(Color("black"), 0.02).string();
  dark.replyBackground = Color(backgroundColor.dark).mix(Color("white"), 0.1).string();
  light.quoteBackground = Color(backgroundColor.light).mix(Color("black"), 0.04).string();
  dark.quoteBackground = Color(backgroundColor.dark).mix(Color("white"), 0.2).string();
  light.quoteReference = Color(backgroundColor.light).mix(Color("black"), 0.1).string();
  dark.quoteReference = Color(backgroundColor.dark).mix(Color("white"), 0.9).string();
  return {
    light,
    dark,
  };
}
