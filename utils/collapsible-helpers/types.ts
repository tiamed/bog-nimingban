import type { EasingFunction } from "react-native";

export type State = "expanded" | "collapsed";

export type Config = {
  duration?: number;
  easing?: EasingFunction;
};
