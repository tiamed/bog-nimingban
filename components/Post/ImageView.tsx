import { StyleProp, TouchableOpacity } from "react-native";
import CachedImage from "expo-cached-image";
import { Image } from "../../api";
import { thumbnailResizeAtom } from "../../atoms";
import { useAtom } from "jotai";

export default function ImageView(props: {
  onPress: () => void;
  data: Image;
  style: StyleProp<any>;
  imageStyle: StyleProp<any>;
  path?: string;
}) {
  const [thumbnailResize] = useAtom(thumbnailResizeAtom);
  return (
    <TouchableOpacity onPress={props.onPress} style={props.style}>
      <CachedImage
        source={{ uri: getThumbnailUrl(props.data, props.path) }}
        cacheKey={`${props.data.url}-thumb-${props.path || ""}`}
        resizeMode={thumbnailResize}
        style={props.imageStyle}
      />
    </TouchableOpacity>
  );
}

export function getThumbnailUrl(image: any, path: string = "image") {
  if (path === "image_pre") {
    return `http://bog.ac/${path}/thumb/${image.url}`;
  }
  return `http://bog.ac/${path}/thumb/${image.url}${image.ext}`;
}

export function getImageUrl(image: any) {
  return `http://bog.ac/image/large/${image.url}${image.ext}`;
}
