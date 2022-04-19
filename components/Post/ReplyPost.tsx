import { useNavigation } from "@react-navigation/native";
import { useAtom, useSetAtom } from "jotai";
import { useContext, useMemo } from "react";
import { PixelRatio, Pressable, View } from "react-native";

import { SizeContext } from "../ThemeContextProvider";
import Header from "./Header";
import HtmlView from "./HtmlView";
import ImageView, { getImageUrl } from "./ImageView";
import Wrapper from "./Wrapper";

import { Image, Post } from "@/api";
import { imageWidthAtom, lineHeightAtom, previewIndexAtom, previewsAtom } from "@/atoms";
import { useThemeColor } from "@/components/Themed";

export default function ReplyPost(props: {
  data: Partial<Post>;
  po?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  onImagePress?: (image: Image) => void;
  width?: number | string;
  level?: number;
  maxHeight?: number;
}) {
  const [previews] = useAtom(previewsAtom);
  const [imageWidth] = useAtom(imageWidthAtom);
  const setPreviewIndex = useSetAtom(previewIndexAtom);
  const navigation = useNavigation();
  const borderColor = useThemeColor({}, "border");
  const isPo = props.data.cookie === props.po;
  const onImagePress = (image: Image) => {
    setPreviewIndex(previews.findIndex((item) => item.url === getImageUrl(image)));
    navigation.navigate("PreviewModal");
  };

  const memoizedHtmlView = useMemo(() => {
    return <HtmlView content={props.data.content as string} level={props.level || 1} />;
  }, [props.data.content, props.level]);
  const memoizedImageView = useMemo(() => {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}>
        {props.data?.images?.map((image) => (
          <ImageView
            key={image.url}
            onPress={props.onImagePress?.bind(null, image) || onImagePress.bind(null, image)}
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
  }, [props.data?.images]);

  return (
    <Pressable onPress={props.onPress} onLongPress={props.onLongPress}>
      <Wrapper width={props.width}>
        <Header data={props.data} isPo={isPo} />
        <View
          style={{
            flexDirection: "column",
            overflow: "hidden",
            flexWrap: "wrap",
          }}>
          <View
            style={{
              maxHeight: props.maxHeight || 9999,
              overflow: "hidden",
            }}>
            {memoizedHtmlView}
          </View>
          {memoizedImageView}
        </View>
      </Wrapper>
    </Pressable>
  );
}
