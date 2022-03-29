import { StyleProp, TouchableOpacity } from "react-native";
import CachedImage from "expo-cached-image";
import { Image } from "../../api";

export default function ImageView(props: {
  onPress: () => void;
  data: Image;
  style: StyleProp<any>;
  imageStyle: StyleProp<any>;
}) {
  return (
    <TouchableOpacity onPress={props.onPress} style={props.style}>
      <CachedImage
        source={{ uri: getThumbnailUrl(props.data) }}
        cacheKey={`${props.data.url}-thumb`}
        resizeMode="contain"
        style={props.imageStyle}
      />
    </TouchableOpacity>
  );
}

export function getThumbnailUrl(image: any) {
  return `http://bog.ac/image/thumb/${image.url}${image.ext}`;
}

export function getImageUrl(image: any) {
  return `http://bog.ac/image/large/${image.url}${image.ext}`;
}
