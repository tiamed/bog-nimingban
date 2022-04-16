import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useSetAtom } from "jotai";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useIsMounted } from "usehooks-ts";

import { getImageUrl, getThumbnailUrl } from "./ImageView";
import ReplyPost from "./ReplyPost";

import { getReply, Post, Reply, Image } from "@/api";
import { previewIndexAtom, previewsAtom } from "@/atoms";
import { SizeContext } from "@/components/ThemeContextProvider";
import { Text, useThemeColor } from "@/components/Themed";
import { MainPostContext } from "@/screens/PostScreen";

export default function ReplyPostWithoutData(props: {
  id: number;
  width: string | number;
  level: number;
  onLoaded?: () => void;
}) {
  const [data, setData] = useState<Reply>({ content: "加载中..." } as Reply);
  const setPreviews = useSetAtom(previewsAtom);
  const setPreviewIndex = useSetAtom(previewIndexAtom);
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "quoteBackground");
  const navigation = useNavigation<StackNavigationProp<any>>();
  const BASE_SIZE = useContext(SizeContext);
  const mainPost = useContext<Post>(MainPostContext);
  const isMounted = useIsMounted();

  const loadData = async () => {
    if (!isMounted) return;
    try {
      const {
        data: { info },
      } = await getReply(props.id);
      if (typeof info === "string") {
        return;
      } else {
        setData(info);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    loadData().then(() => {
      if (props.onLoaded) {
        props.onLoaded();
      }
    });
  }, [props.id]);
  return (
    <View style={{ flexDirection: "row", width: "100%", backgroundColor }}>
      {!!data.id && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
            alignContent: "stretch",
          }}>
          {mainPost.id !== data.res && mainPost.id !== data.id && (
            <View style={styles.actionWrapper}>
              <TouchableOpacity
                onPress={() => {
                  navigation.push("Post", {
                    id: data.res || data.id,
                    title: "",
                  });
                }}>
                <Text
                  style={{
                    fontSize: BASE_SIZE * 0.8,
                  }}
                  lightColor={tintColor}
                  darkColor={tintColor}>
                  查看原串
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <ReplyPost
            data={data}
            po={mainPost.cookie}
            width={props.width}
            level={props.level}
            onImagePress={(image: Image) => {
              setPreviews(
                data.images.map((item) => ({
                  url: getImageUrl(item),
                  originalUrl: getThumbnailUrl(item),
                }))
              );
              setPreviewIndex(data.images.findIndex((item) => item.url === image.url));
              navigation.navigate("PreviewModal");
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionWrapper: {
    paddingRight: 10,
  },
});
