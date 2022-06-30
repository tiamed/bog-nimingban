import Color from "color";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import useColorScheme from "./useColorScheme";

import { cardColorDarkAtom, cardColorLightAtom } from "@/atoms";

export const useStatusBarStyle = () => {
  const [cardColorLight] = useAtom(cardColorLightAtom);
  const [cardColorDark] = useAtom(cardColorDarkAtom);
  const colorScheme = useColorScheme();
  const [statusBarStyle, setStatusBarStyle] = useState<"light" | "dark">("light");

  useEffect(() => {
    const cardColor = colorScheme === "light" ? cardColorLight : cardColorDark;
    const luminocity = Color(cardColor).luminosity();
    setStatusBarStyle(luminocity > 0.5 ? "dark" : "light");
  }, [colorScheme, cardColorLight, cardColorDark]);

  return statusBarStyle;
};
