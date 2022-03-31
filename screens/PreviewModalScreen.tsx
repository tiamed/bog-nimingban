import { StatusBar } from "expo-status-bar";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-root-toast";

import { useAtom } from "jotai";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ImageViewer from "react-native-image-zoom-viewer";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";
import { previewIndexAtom, previewsAtom } from "../atoms";
import { FloatingAction } from "react-native-floating-action";
import { useThemeColor } from "../components/Themed";
import TabBarIcon from "../components/TabBarIcon";

export default function PreviewModalScreen() {
  const navigation = useNavigation();
  const [previews] = useAtom(previewsAtom);
  const [previewIndex] = useAtom(previewIndexAtom);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const tintColor = useThemeColor({}, "tint");

  const saveImage = async () => {
    if (!status?.granted) {
      requestPermission();
    } else {
      try {
        const { uri } = await FileSystem.downloadAsync(
          previews[previewIndex].url,
          FileSystem.documentDirectory +
            previews[previewIndex].url.replace("http://bog.ac/image/large/", "")
        );

        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.createAlbumAsync(
          "bog-nimingban",
          asset,
          false
        );
        Toast.show("已保存图片", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      } catch (error) {
        Toast.show(error as string);
      }
    }
  };
  return (
    <>
      {/* <StatusBar hidden /> */}
      <ImageViewer
        index={previewIndex}
        imageUrls={previews as IImageInfo[]}
        enableSwipeDown={true}
        onSwipeDown={() => navigation.goBack()}
      />
      <FloatingAction
        color={tintColor}
        overrideWithAction={true}
        actions={[
          {
            icon: <TabBarIcon name="save" color="white" />,
            name: "save",
          },
        ]}
        onPressItem={saveImage}
      ></FloatingAction>
    </>
  );
}
