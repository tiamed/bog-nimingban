import { useNavigation } from "@react-navigation/native";
import { useAtom, useSetAtom } from "jotai";
import { useContext, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import Icon from "../Icon";
import { Text, useThemeColor } from "../Themed";
import ImageView, { getImageUrl } from "./ImageView";

import { SizeContext } from "@/Provider";
import { Image } from "@/api";
import { imageWidthAtom, previewUrlAtom, previewsAtom } from "@/atoms";
import useShowImage from "@/hooks/useShowImage";

export default function ImageList(props: {
  images: Image[];
  previews?: Image[];
  onPress?: (image: Image) => void;
}) {
  const [imageWidth] = useAtom(imageWidthAtom);
  const setPreviews = useSetAtom(previewsAtom);
  const setPreviewUrl = useSetAtom(previewUrlAtom);
  const navigation = useNavigation();
  const borderColor = useThemeColor({}, "border");
  const inactiveColor = useThemeColor({}, "inactive");
  const showImage = useShowImage();
  const BASE_SIZE = useContext(SizeContext);

  const onPress = (image: Image) => {
    const images = props.previews || props.images;
    setPreviews(
      images.map((item) => ({
        url: getImageUrl(item),
      }))
    );
    setPreviewUrl(getImageUrl(image));
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
        {showImage ? (
          props.images?.map((image) => (
            <ImageView
              key={image.url}
              onPress={props.onPress?.bind(null, image) || onPress.bind(null, image)}
              style={{
                flexBasis: imageWidth,
                aspectRatio: 1,
                borderColor,
                borderWidth: 1,
                marginTop: "1%",
                marginRight: "1%",
              }}
              imageStyle={{
                width: "100%",
                height: "100%",
              }}
              data={image}
            />
          ))
        ) : (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={
              props.onPress?.bind(null, props.images[0]) || onPress.bind(null, props.images[0])
            }>
            <Icon name="image" color={inactiveColor} size={BASE_SIZE * 0.8} />
            <Text lightColor="#666666" darkColor="#999999" style={{ fontSize: BASE_SIZE * 0.8 }}>
              共{props.images.length}张图片
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [props.images, imageWidth, showImage]);

  return memoizedImageView;
}
