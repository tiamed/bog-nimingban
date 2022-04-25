import CachedImage from "expo-cached-image";
import { useAtom } from "jotai";
import { StyleProp, TouchableOpacity } from "react-native";

import { Image } from "@/api";
import { thumbnailResizeAtom } from "@/atoms";
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
  const showImage = useShowImage();
  return (
    <TouchableOpacity onPress={props.onPress} style={props.style}>
      {showImage ? (
        <CachedImage
          source={{ uri: getThumbnailUrl(props.data, props.path) }}
          cacheKey={`${props.data.url}-thumb-${props.path || ""}`}
          resizeMode={thumbnailResize}
          style={props.imageStyle}
        />
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
