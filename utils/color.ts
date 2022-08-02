import Color from "color";

import { reduceWhich } from "./helper";

export function getContrastColor(candidates: string[], color: string) {
  const against = Color(color);

  return reduceWhich(
    candidates,
    (a: string, b: string) => against.contrast(Color(b)) - against.contrast(Color(a))
  );
}

export function getFirstContrastColor(candidates: string[], color: string, contrast: number = 2) {
  const against = Color(color);
  return candidates.find((c) => against.contrast(Color(c)) >= contrast) || color;
}
