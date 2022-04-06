import { createContext } from "react";

import useColorScheme from "@/hooks/useColorScheme";
import useSize from "@/hooks/useSize";

export const ColorSchemeContext = createContext("light");
export const SizeContext = createContext(16);

export function ColorSchemeProvider(props: any) {
  const colorScheme = useColorScheme();
  const size = useSize();

  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      <SizeContext.Provider value={size}>{props.children}</SizeContext.Provider>
    </ColorSchemeContext.Provider>
  );
}

export const ThemeContextConsumer = ColorSchemeContext.Consumer;
export const ThemeContextProvider = ColorSchemeContext;
