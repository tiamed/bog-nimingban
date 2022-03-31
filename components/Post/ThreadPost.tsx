import { Pressable } from "react-native";
import { useSetAtom } from "jotai";

import { Post, Image } from "../../api";
import { View } from "../Themed";
import { useForumsIdMap } from "../../hooks/useForums";
import { previewIndexAtom, previewsAtom } from "../../atoms";
import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import HtmlView from "./HtmlView";
import Header from "./Header";
import ImageView, { getImageUrl, getThumbnailUrl } from "./ImageView";
import Wrapper from "./Wrapper";
import useSize from "../../hooks/useSize";

export default function ThreadPost(props: {
  data: Partial<Post>;
  onPress?: () => void;
  maxLine?: number;
}) {
  const forumsIdMap = useForumsIdMap();
  const setPreviews = useSetAtom(previewsAtom);
  const setPreviewIndex = useSetAtom(previewIndexAtom);
  const navigation = useNavigation();
  const BASE_SIZE = useSize();
  const images = useMemo(() => {
    const { data } = props;
    const result: Image[] = data.images || [];
    data.reply?.forEach(({ images: replyImages }) => {
      if (replyImages?.length) {
        result.push(...replyImages);
      }
    });
    return result;
  }, [props.data]);

  const OnPress = () => {
    navigation.navigate("Post", {
      id: props.data.id as number,
      title: `${forumsIdMap.get(props.data.forum as number)} Po.${
        props.data.id
      }`,
    });
  };

  return (
    <Pressable onPress={props.onPress || OnPress}>
      <Wrapper>
        <Header data={props.data} isPo={false} showForum></Header>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            overflow: "hidden",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              flex: 2,
              maxHeight: BASE_SIZE * 1.3 * (props.maxLine || 50),
            }}
          >
            <HtmlView content={props.data.content as string}></HtmlView>
          </View>
          {props.data.images && props.data.images[0] && (
            <ImageView
              onPress={() => {
                setPreviewIndex(0);
                setPreviews(
                  images.map((item) => ({
                    url: getImageUrl(item),
                    originalUrl: getThumbnailUrl(item),
                  }))
                );
                navigation.navigate("PreviewModal");
              }}
              data={props.data.images[0]}
              imageStyle={{
                flex: 1,
                width: 150,
                height: "100%",
                minHeight: 150,
                marginTop: 10,
              }}
              style={{}}
            ></ImageView>
          )}
        </View>
      </Wrapper>
    </Pressable>
  );
}
