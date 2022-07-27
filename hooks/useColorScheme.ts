import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { ColorSchemeName, useColorScheme as _useColorScheme } from "react-native";

import { colorSchemeAtom } from "@/atoms";

// The useColorScheme value is always either light or dark, but the built-in
// type suggests that it can be null. This will not happen in practice, so this
// makes it a bit easier to work with.
export default function useColorScheme(): NonNullable<ColorSchemeName> {
  const systemColorScheme = _useColorScheme();
  const [scheme, setScheme] = useState<ColorSchemeName>(systemColorScheme);
  const [colorScheme] = useAtom(colorSchemeAtom);
  useEffect(() => {
    if (colorScheme) {
      setScheme(colorScheme);
    } else {
      setScheme(systemColorScheme);
    }
  }, [colorScheme, systemColorScheme]);
  return scheme as NonNullable<ColorSchemeName>;
}
