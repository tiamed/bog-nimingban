import { useNavigation } from "@react-navigation/native";
import CachedImage from "expo-cached-image";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { StyleSheet, Image, ActivityIndicator, View, Platform } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import ImageViewer from "react-native-image-zoom-viewer";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";
import Toast from "react-native-toast-message";

import LongImageModal from "./LongImageModal";

import { previewIndexAtom, previewsAtom, nativeImageRendererAtom } from "@/atoms";
import Icon from "@/components/Icon";
import { parseImageUrl } from "@/components/Post/ImageView";
import { useThemeColor } from "@/components/Themed";
import Urls from "@/constants/Urls";

const brokenImageUri = Image.resolveAssetSource(require("@/assets/images/image-broken-2x.png")).uri;

export default function PreviewModalScreen() {
  const navigation = useNavigation();
  const [nativeImageRenderer] = useAtom(nativeImageRendererAtom);
  const [previews] = useAtom(previewsAtom);
  const [previewIndex] = useAtom(previewIndexAtom);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(previewIndex);
  const [isLongImage, setIsLongImage] = useState(false);
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
          previews[index].url,
          FileSystem.cacheDirectory + previews[index].url.replace(`${Urls.baseURL}image/large/`, "")
        );

        await callback(uri);
      } catch (error) {
        Toast.show({ type: "error", text1: (error as Error).message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const saveImage = () => {
    getImage(async (uri) => {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync("bog-nimingban");
      // android 11 and above requires confirmation to move files(see https://source.android.com/docs/core/storage/scoped)
      if (Platform.OS === "ios" || (Platform.OS === "android" && Platform.Version < 30)) {
        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        } else {
          await MediaLibrary.createAlbumAsync("bog-nimingban", asset, false);
        }
      }
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
      <ImageViewer
        index={previewIndex}
        imageUrls={previews as IImageInfo[]}
        enableSwipeDown
        onSwipeDown={() => navigation.goBack()}
        onClick={() => navigation.goBack()}
        saveToLocalByLongPress={false}
        onChange={(index) => setIndex(index!)}
        loadingRender={() =>
          previews?.[index] && (
            <>
              {nativeImageRenderer ? (
                <CachedImage
                  source={{ uri: previews[index].url?.replace("large", "thumb") }}
                  cacheKey={`${parseImageUrl(previews[index].url)?.url}-thumb-`}
                  resizeMode="contain"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              ) : (
                <Image
                  source={{ uri: previews[index].url?.replace("large", "thumb") }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="contain"
                />
              )}
              <View style={styles.indicatorContainer}>
                <ActivityIndicator color={activeColor} size="large" />
              </View>
            </>
          )
        }
        failImageSource={{
          url: brokenImageUri,
          width: 400,
          height: 300,
        }}
      />
      <FloatingAction
        color={isLoading ? inactiveColor : activeColor}
        overrideWithAction
        distanceToEdge={{ horizontal: 190, vertical: 30 }}
        actions={[
          {
            icon: <Icon family="Ionicons" name="scan" color="white" size={20} />,
            name: "magnify",
          },
        ]}
        onPressItem={() => {
          setIsLongImage(true);
        }}
      />
      <FloatingAction
        color={isLoading ? inactiveColor : activeColor}
        overrideWithAction
        distanceToEdge={{ horizontal: 110, vertical: 30 }}
        actions={[
          {
            icon: <Icon family="Ionicons" name="share-social" color="white" size={20} />,
            name: "share",
          },
        ]}
        onPressItem={shareImage}
      />
      <FloatingAction
        color={isLoading ? inactiveColor : activeColor}
        overrideWithAction
        distanceToEdge={{ horizontal: 30, vertical: 30 }}
        actions={[
          {
            icon: <Icon family="Ionicons" name="save-sharp" color="white" size={20} />,
            name: "save",
          },
        ]}
        onPressItem={saveImage}
      />
      <LongImageModal
        visible={isLongImage}
        uri={previews[index].url}
        onDismiss={() => {
          setIsLongImage(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  indicatorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
