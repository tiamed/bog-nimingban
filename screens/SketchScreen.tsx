import { useSetAtom } from "jotai";
import { Canvas } from "katachidraw/src/library";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Pressable } from "react-native";
import { captureRef } from "react-native-view-shot";

import { sketchUriAtom } from "@/atoms";
import Icon from "@/components/Icon";
import { useThemeColor, View } from "@/components/Themed";
import { RootStackScreenProps } from "@/types";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function SketchScreen({ route, navigation }: RootStackScreenProps<"About">) {
  const [isCapturing, setIsCapturing] = useState(false);
  const viewRef = useRef(null);

  const setSketchUri = useSetAtom(sketchUriAtom);
  const tintColor = useThemeColor({}, "tint");

  const onPress = useCallback(async () => {
    setIsCapturing(true);
    await new Promise((end) => setTimeout(end, 200));
    const result = await captureRef(viewRef, {
      result: "tmpfile",
      height,
      width,
      quality: 1,
      format: "png",
    });
    setSketchUri(result);
    setIsCapturing(false);
    navigation.goBack();
  }, [viewRef]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={onPress}>
          <Icon name="check" color={tintColor} />
        </Pressable>
      ),
    });
  }, []);

  return (
    <View ref={viewRef} collapsable={false}>
      <Canvas
        width={width}
        height={height}
        sliderPosition={isCapturing ? [0, 0] : undefined}
        toolbarPosition={isCapturing ? [-100, 0] : undefined}
      />
    </View>
  );
}
