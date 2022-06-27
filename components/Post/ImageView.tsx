import CachedImage from "expo-cached-image";
import { useAtom } from "jotai";
import { ActivityIndicator, Image as RNImage, StyleProp, TouchableOpacity } from "react-native";

import { useThemeColor } from "../Themed";

import { Image } from "@/api";
import { nativeImageRendererAtom, thumbnailResizeAtom } from "@/atoms";
import Urls from "@/constants/Urls";
import useShowImage from "@/hooks/useShowImage";

export default function ImageView(props: {
  onPress: () => void;
  data: Image;
  style: StyleProp<any>;
  imageStyle: StyleProp<any>;
  path?: string;
}) {
  const [thumbnailResize] = useAtom(thumbnailResizeAtom);
  const [nativeImageRenderer] = useAtom(nativeImageRendererAtom);
  const showImage = useShowImage();
  const tintColor = useThemeColor({}, "tint");
  return (
    <TouchableOpacity onPress={props.onPress} style={props.style}>
      {showImage ? (
        nativeImageRenderer ? (
          <RNImage
            source={{ uri: getThumbnailUrl(props.data, props.path) }}
            style={props.imageStyle}
            resizeMode={thumbnailResize}
          />
        ) : (
          <CachedImage
            source={{ uri: getThumbnailUrl(props.data, props.path) }}
            cacheKey={`${props.data.url}-thumb-${props.path || ""}`}
            resizeMode={thumbnailResize}
            style={props.imageStyle}
            placeholderContent={
              <ActivityIndicator
                color={tintColor}
                size="small"
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              />
            }
          />
        )
      ) : null}
    </TouchableOpacity>
  );
}

export function getThumbnailUrl(image: any, path: string = "image") {
  if (path === "image_pre") {
    return `${Urls.baseURL}${path}/thumb/${image.url}`;
  }
  return `${Urls.baseURL}${path}/thumb/${image.url}${image.ext}`;
}

export function getImageUrl(image: any) {
  return `${Urls.baseURL}image/large/${image.url}${image.ext}`;
}

export function parseImageUrl(url: string) {
  const match = url.match(/\/image\/large\/(.*)(\..*)/);
  if (match) {
    return {
      url: match[1],
      ext: match[2],
    };
  }
}
