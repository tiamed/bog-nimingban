import React, { useCallback } from "react";
import type { LayoutChangeEvent } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing as ReanimatedEasing,
} from "react-native-reanimated";

import type { Config, State } from "./types";

export function useCollapsible(config?: Config) {
  const [height, setHeight] = React.useState(0);
  const [state, setState] = React.useState<State>("collapsed");

  const animatedHeight = useSharedValue(0);

  React.useEffect(() => {
    if (state === "collapsed") {
      animatedHeight.value = withTiming(0, {
        duration: config?.duration || 300,
        easing: config?.easing || ReanimatedEasing.inOut(ReanimatedEasing.ease),
      });
    } else {
      animatedHeight.value = withTiming(height, {
        duration: config?.duration || 300,
        easing: config?.easing || ReanimatedEasing.inOut(ReanimatedEasing.ease),
      });
    }
  }, [state, height, animatedHeight, config]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
    };
  });

  const onPress = useCallback(() => {
    setState((prev) => (prev === "collapsed" ? "expanded" : "collapsed"));
  }, []);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const measuredHeight = event.nativeEvent.layout.height;

      if (height !== measuredHeight) {
        setHeight(measuredHeight);
      }
    },
    [height]
  );

  return {
    onLayout,
    onPress,
    animatedStyle,
    state,
  };
}
