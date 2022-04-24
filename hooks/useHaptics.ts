import * as Haptics from "expo-haptics";
import { useAtom } from "jotai";

import { vibrateAtom } from "@/atoms";

export default function useHaptics() {
  const [vibrate] = useAtom(vibrateAtom);
  return vibrate
    ? {
        light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
      }
    : {
        light: () => {},
        heavy: () => {},
      };
}
