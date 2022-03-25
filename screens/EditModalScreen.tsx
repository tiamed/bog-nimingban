import { StatusBar } from "expo-status-bar";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-root-toast";

import { useAtom } from "jotai";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { previewIndexAtom, previewsAtom } from "../atoms";
import { useThemeColor } from "../components/Themed";
import TabBarIcon from "../components/TabBarIcon";

export default function PreviewModalScreen() {
  const navigation = useNavigation();
  const [previews] = useAtom(previewsAtom);
  const [previewIndex] = useAtom(previewIndexAtom);
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const saveImage = async () => {
    if (!status?.granted) {
      requestPermission();
    } else {
      const { uri } = await FileSystem.downloadAsync(
        previews[previewIndex].url,
        FileSystem.documentDirectory +
          previews[previewIndex].url.replace("http://bog.ac/image/large/", "")
      );
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.createAlbumAsync("bog-nimingban", asset);
      Toast.show("已保存图片", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  };
  return (
    <>
      {/* <StatusBar hidden /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
