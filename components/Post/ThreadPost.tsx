import { TouchableOpacity, Dimensions } from "react-native";
import { useSetAtom } from "jotai";

import { Post, Image } from "../../api";
import { View, Text, useThemeColor } from "../Themed";
import useForums, { useForumsIdMap } from "../../hooks/useForums";
import { previewIndexAtom, previewsAtom } from "../../atoms";
import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import HtmlView from "./HtmlView";
import Header from "./Header";
import ImageView, { getImageUrl, getThumbnailUrl } from "./ImageView";
import Wrapper from "./Wrapper";

export default function ThreadPost(props: { data: Partial<Post> }) {
  const forumsIdMap = useForumsIdMap();
  const setPreviews = useSetAtom(previewsAtom);
  const setPreviewIndex = useSetAtom(previewIndexAtom);
  const navigation = useNavigation();
  const borderColor = useThemeColor({}, "border");
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

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Post", {
          id: props.data.id as number,
          title: `${forumsIdMap.get(props.data.forum as number)} Po.${
            props.data.id
          }`,
        });
      }}
    >
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
    </TouchableOpacity>
  );
}
