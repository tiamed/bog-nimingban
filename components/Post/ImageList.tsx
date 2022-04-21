import { useNavigation } from "@react-navigation/native";
import { useAtom, useSetAtom } from "jotai";
import { useMemo } from "react";
import { View } from "react-native";

import { useThemeColor } from "../Themed";
import ImageView, { getImageUrl } from "./ImageView";

import { Image } from "@/api";
import { imageWidthAtom, previewIndexAtom, previewsAtom } from "@/atoms";

export default function ImageList(props: {
  images: Image[];
  previews?: Image[];
  onPress?: (image: Image) => void;
}) {
  const [imageWidth] = useAtom(imageWidthAtom);
  const setPreivews = useSetAtom(previewsAtom);
  const setPreviewIndex = useSetAtom(previewIndexAtom);
  const navigation = useNavigation();
  const borderColor = useThemeColor({}, "border");

  const onPress = (image: Image) => {
    const images = props.previews || props.images;
    setPreivews(
      images.map((item) => ({
        url: getImageUrl(item),
      }))
    );
    setPreviewIndex(images.findIndex((item) => item.url === image.url));
    navigation.navigate("PreviewModal");
  };
  const memoizedImageView = useMemo(() => {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}>
        {props.images?.map((image) => (
          <ImageView
            key={image.url}
            onPress={props.onPress?.bind(null, image) || onPress.bind(null, image)}
            style={{
              flexBasis: imageWidth,
              aspectRatio: 1,
              borderColor,
              borderWidth: 1,
              marginTop: 10,
              marginRight: "1%",
            }}
            imageStyle={{
              width: "100%",
              height: "100%",
            }}
            data={image}
          />
        ))}
      </View>
    );
  }, [props.images, imageWidth]);

  return memoizedImageView;
}
