import { Pressable } from "react-native";
import { useAtom, useSetAtom } from "jotai";

import { Image, Post } from "../../api";
import { View, useThemeColor } from "../Themed";
import { previewIndexAtom, previewsAtom } from "../../atoms";
import { useNavigation } from "@react-navigation/native";
import HtmlView from "./HtmlView";
import Header from "./Header";
import ImageView, { getImageUrl } from "./ImageView";
import Wrapper from "./Wrapper";

export default function ReplyPost(props: {
  data: Partial<Post>;
  po: string;
  onPress?: () => void;
  onImagePress?: (image: Image) => void;
  width?: number | string;
  level?: number;
}) {
  const [previews] = useAtom(previewsAtom);
  const setPreviewIndex = useSetAtom(previewIndexAtom);
  const navigation = useNavigation();
  const borderColor = useThemeColor({}, "border");
  const isPo = props.data.cookie === props.po;
  const onImagePress = (image: Image) => {
    setPreviewIndex(
      previews.findIndex((item) => item.url === getImageUrl(image))
    );
    navigation.navigate("PreviewModal");
  };

  return (
    <Pressable onPress={props.onPress}>
      <Wrapper width={props.width}>
        <Header data={props.data} isPo={isPo}></Header>

        <View
          style={{
            flexDirection: "column",
            overflow: "hidden",
            flexWrap: "wrap",
            marginRight: 8,
          }}
        >
          <View>
            <HtmlView
              content={props.data.content as string}
              level={props.level || 1}
            ></HtmlView>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {props.data?.images?.map((image) => (
              <ImageView
                key={image.url}
                onPress={
                  props.onImagePress?.bind(null, image) ||
                  onImagePress.bind(null, image)
                }
                style={{
                  flexBasis: "48%",
                  aspectRatio: 1,
                  borderColor: borderColor,
                  borderWidth: 1,
                  marginTop: 10,
                }}
                imageStyle={{
                  width: "100%",
                  height: "100%",
                }}
                data={image}
              />
            ))}
          </View>
        </View>
      </Wrapper>
    </Pressable>
  );
}
