import { useTheme } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useSetAtom } from "jotai";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";
import WebView from "react-native-webview";

import { sketchUriAtom } from "@/atoms";
import Icon from "@/components/Icon";
import { View } from "@/components/Themed";
import { RootStackScreenProps } from "@/types";

export default function SketchScreen({ route, navigation }: RootStackScreenProps<"About">) {
  const [isCapturing, setIsCapturing] = useState(false);
  const viewRef = useRef(null);
  const webRef = useRef<WebView>(null);

  const setSketchUri = useSetAtom(sketchUriAtom);
  const { colors } = useTheme();

  const onPress = useCallback(async () => {
    setIsCapturing(true);
  }, [viewRef]);

  const onMessage = async (event: any) => {
    const base64Code = event.nativeEvent.data.split("data:image/png;base64,")[1];

    const filename = FileSystem.documentDirectory + `Sketch_${Date.now()}.png`;
    await FileSystem.writeAsStringAsync(filename, base64Code, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await MediaLibrary.saveToLibraryAsync(filename);
    setSketchUri(filename);
    setIsCapturing(false);
    navigation.goBack();
  };

  useEffect(() => {
    if (isCapturing) {
      const hideTools = `
      function hideElement(query) {
        const element = document.querySelector(query);
        if (element) {
          element.style.display = 'none';
        }
      }
      const elements = ['.FixedSideContainer', '.App-bottom-bar', 'footer'];
      elements.forEach(hideElement);

      setTimeout(() => {
        const canvas = document.querySelector('canvas');
        const image = canvas.toDataURL("image/png");
        window.ReactNativeWebView.postMessage(image);
      }, 200);
      `;

      webRef.current?.injectJavaScript(hideTools);
    }
  }, [isCapturing]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={onPress}>
          <Icon name="check" color={colors.primary} />
        </Pressable>
      ),
    });
  }, []);

  return (
    <View ref={viewRef} collapsable={false} style={{ flex: 1 }}>
      <WebView ref={webRef} source={{ uri: "https://excalidraw.com/" }} onMessage={onMessage} />
    </View>
  );
}
