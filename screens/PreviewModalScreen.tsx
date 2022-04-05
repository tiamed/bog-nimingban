import { StatusBar } from "expo-status-bar";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";

import { useAtom } from "jotai";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ImageViewer from "react-native-image-zoom-viewer";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";
import { previewIndexAtom, previewsAtom } from "../atoms";
import { FloatingAction } from "react-native-floating-action";
import { useThemeColor } from "../components/Themed";

export default function PreviewModalScreen() {
  const navigation = useNavigation();
  const [previews] = useAtom(previewsAtom);
  const [previewIndex] = useAtom(previewIndexAtom);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [isLoading, setIsLoading] = useState(false);
  const activeColor = useThemeColor({}, "active");
  const inactiveColor = useThemeColor({}, "inactive");

  const getImage = async (callback: (uri: string) => any) => {
    if (isLoading) {
      return;
    }
    if (!status?.granted) {
      requestPermission();
    } else {
      try {
        setIsLoading(true);
        const { uri } = await FileSystem.downloadAsync(
          previews[previewIndex].url,
          FileSystem.documentDirectory +
            previews[previewIndex].url.replace("http://bog.ac/image/large/", "")
        );

        await callback(uri);
      } catch (error) {
        Toast.show({ type: "error", text1: error as string });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const saveImage = () => {
    getImage(async (uri) => {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.createAlbumAsync(
        "bog-nimingban",
        asset,
        false
      );
      Toast.show({ type: "success", text1: "已保存图片" });
    });
  };

  const shareImage = () => {
    getImage(async (uri) => {
      await Sharing.shareAsync(uri);
    });
  };
  return (
    <>
      {/* <StatusBar hidden /> */}
      <ImageViewer
        index={previewIndex}
        imageUrls={previews as IImageInfo[]}
        enableSwipeDown={true}
        onSwipeDown={() => navigation.goBack()}
        saveToLocalByLongPress={false}
      />
      <FloatingAction
        color={isLoading ? inactiveColor : activeColor}
        overrideWithAction={true}
        distanceToEdge={{ horizontal: 110, vertical: 30 }}
        actions={[
          {
            icon: (
              <MaterialCommunityIcons
                name="share-variant"
                color="white"
                size={20}
              />
            ),
            name: "share",
          },
        ]}
        onPressItem={shareImage}
      ></FloatingAction>
      <FloatingAction
        color={isLoading ? inactiveColor : activeColor}
        overrideWithAction={true}
        actions={[
          {
            icon: (
              <MaterialCommunityIcons
                name="content-save"
                color="white"
                size={20}
              />
            ),
            name: "save",
          },
        ]}
        onPressItem={saveImage}
      ></FloatingAction>
    </>
  );
}
