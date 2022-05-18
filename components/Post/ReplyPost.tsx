import { useNavigation } from "@react-navigation/native";
import { useSetAtom } from "jotai";
import { useMemo } from "react";
import { View } from "react-native";
import { TouchableRipple } from "react-native-paper";

import { useThemeColor } from "../Themed";
import Header from "./Header";
import HtmlView from "./HtmlView";
import ImageList from "./ImageList";
import { getImageUrl } from "./ImageView";
import Wrapper from "./Wrapper";

import { Image, Post } from "@/api";
import { previewUrlAtom } from "@/atoms";

export default function ReplyPost(props: {
  data: Partial<Post>;
  po?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  onImagePress?: (image: Image) => void;
  width?: number | string;
  level?: number;
  maxHeight?: number;
  hideFeedBack?: boolean;
  withPadding?: boolean;
}) {
  const setPreviewUrl = useSetAtom(previewUrlAtom);
  const navigation = useNavigation();
  const tintBackgroundColor = useThemeColor({}, "tintBackground");
  const isPo = props.data.cookie === props.po;
  const onImagePress = (image: Image) => {
    setPreviewUrl(getImageUrl(image));
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
        {props.data?.images && (
          <ImageList
            images={props.data.images}
            onPress={(image) => {
              if (props.onImagePress) {
                props.onImagePress(image);
              } else {
                onImagePress(image);
              }
            }}
          />
        )}
      </View>
    );
  }, [props.data?.images]);

  return (
    <TouchableRipple
      rippleColor={props.hideFeedBack ? "transparent" : tintBackgroundColor}
      underlayColor={props.hideFeedBack ? "transparent" : tintBackgroundColor}
      onPress={props.onPress}
      onLongPress={props.onLongPress}>
      <Wrapper width={props.width} withPadding={props.withPadding}>
        <Header data={props.data} isPo={isPo} />
        <View
          style={{
            flexDirection: "column",
            overflow: "hidden",
            flexWrap: "wrap",
          }}>
          <View
            style={{
              maxHeight: props.maxHeight || undefined,
              overflow: "hidden",
            }}>
            {memoizedHtmlView}
          </View>
          {memoizedImageView}
        </View>
      </Wrapper>
    </TouchableRipple>
  );
}
