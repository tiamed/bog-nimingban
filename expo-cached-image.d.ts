declare module "expo-cached-image" {
  import { ImageSourcePropType, ImageStyle, StyleProp, ImageProps } from "react-native";

  interface CachedImagesProps {
    source?: ImageSourcePropType;
    style: StyleProp<ImageStyle>;
    cacheKey: string;
    resizeMode: string;
  }

  class CachedImages extends React.Component<CachedImagesProps & ImageProps> {}
  export default CachedImages;
}
