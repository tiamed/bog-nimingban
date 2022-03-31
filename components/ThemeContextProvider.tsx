import { createContext, useState } from "react";
import useColorScheme from "../hooks/useColorScheme";

export const ColorSchemeContext = createContext("light");

export function ColorSchemeProvider(props: any) {
  const colorScheme = useColorScheme();

  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      {props.children}
    </ColorSchemeContext.Provider>
  );
}

export const ThemeContextConsumer = ColorSchemeContext.Consumer;
export const ThemeContextProvider = ColorSchemeContext;
