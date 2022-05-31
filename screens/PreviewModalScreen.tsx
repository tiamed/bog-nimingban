import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CachedImage from "expo-cached-image";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { StyleSheet, Image, ActivityIndicator, View } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import ImageViewer from "react-native-image-zoom-viewer";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";
import Toast from "react-native-toast-message";
import WebView from "react-native-webview";

import { previewIndexAtom, previewsAtom } from "@/atoms";
import { parseImageUrl } from "@/components/Post/ImageView";
import { useThemeColor } from "@/components/Themed";
import Urls from "@/constants/Urls";

const brokenImageUri = Image.resolveAssetSource(require("@/assets/images/image-broken-2x.png")).uri;

export default function PreviewModalScreen() {
  const navigation = useNavigation();
  const [previews] = useAtom(previewsAtom);
  const [previewIndex] = useAtom(previewIndexAtom);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(previewIndex);
  const [isWebview, setIsWebview] = useState(false);
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
      await MediaLibrary.createAlbumAsync("bog-nimingban", asset, false);
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
        renderImage={({ source, ...props }) =>
          isWebview ? <WebView source={source} /> : <Image source={source} {...props} />
        }
        loadingRender={() =>
          previews?.[index] && (
            <>
              <CachedImage
                source={{ uri: previews[index].url?.replace("large", "thumb") }}
                cacheKey={`${parseImageUrl(previews[index].url)?.url}-thumb-`}
                resizeMode="contain"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
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
            icon: (
              <MaterialCommunityIcons
                name={isWebview ? "web" : "web-off"}
                color="white"
                size={20}
              />
            ),
            name: "share",
          },
        ]}
        onPressItem={() => {
          Toast.show({
            type: "info",
            text1: isWebview ? "已切换默认渲染模式" : "已切换webview渲染模式",
          });
          setIsWebview(!isWebview);
        }}
      />
      <FloatingAction
        color={isLoading ? inactiveColor : activeColor}
        overrideWithAction
        distanceToEdge={{ horizontal: 110, vertical: 30 }}
        actions={[
          {
            icon: <MaterialCommunityIcons name="share-variant" color="white" size={20} />,
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
            icon: <MaterialCommunityIcons name="content-save" color="white" size={20} />,
            name: "save",
          },
        ]}
        onPressItem={saveImage}
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
