import { useNavigation } from "@react-navigation/native";
import { useAtom, useSetAtom } from "jotai";
import { Fragment, useContext, useMemo } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";

import { useThemeColor } from "../Themed";
import Header from "./Header";
import HtmlView from "./HtmlView";
import ImageList from "./ImageList";
import ImageView, { getImageUrl, getThumbnailUrl } from "./ImageView";
import ReplyPost from "./ReplyPost";
import Wrapper from "./Wrapper";

import { SizeContext, ThreadReplyReverseContext } from "@/Provider";
import { Post, Image } from "@/api";
import { lineHeightAtom, previewUrlAtom, previewsAtom, threadDirectionAtom } from "@/atoms";
import Layout from "@/constants/Layout";
import useHaptics from "@/hooks/useHaptics";

const width = Dimensions.get("window").width;

export default function ThreadPost(props: {
  data: Partial<Post>;
  onPress?: (item?: Partial<Post>) => void;
  onLongPress?: (item?: Partial<Post>) => void;
  gestureEnabled?: boolean;
  maxLine?: number;
  newCount?: number;
  showReply?: boolean;
}) {
  const setPreviews = useSetAtom(previewsAtom);
  const setPreviewUrl = useSetAtom(previewUrlAtom);
  const [threadDirection] = useAtom(threadDirectionAtom);
  const [LINE_HEIGHT] = useAtom(lineHeightAtom);

  const navigation = useNavigation();
  const haptics = useHaptics();
  const borderColor = useThemeColor({}, "border");
  const replyBackgroundColor = useThemeColor({}, "replyBackground");
  const BASE_SIZE = useContext(SizeContext);
  const threadReplyReverse = useContext(ThreadReplyReverseContext);

  const images = useMemo(() => {
    const result: Image[] = [];
    props.data.reply?.forEach(({ images: replyImages }) => {
      if (replyImages?.length) {
        if (threadReplyReverse) {
          result.unshift(...replyImages);
        } else {
          result.push(...replyImages);
        }
      }
    });
    result.unshift(...(props.data.images || []));
    return result;
  }, [props.data, threadReplyReverse]);

  const previews = useMemo(() => {
    return images.map((item) => ({
      url: getImageUrl(item),
      originalUrl: getThumbnailUrl(item),
    }));
  }, [images]);

  const imageSize = useMemo(() => {
    const calculated = LINE_HEIGHT * (props.maxLine || 999) - 2;
    return calculated < 150 ? calculated : 150;
  }, [props.maxLine, BASE_SIZE, LINE_HEIGHT]);

  const OnPress = () => {
    navigation.navigate("Post", {
      id: props.data.id as number,
      title: `Po.${props.data.id}`,
    });
  };

  const PressableWrapper = props.gestureEnabled ? TapGestureHandler : Fragment;

  return (
    <PressableWrapper>
      <Pressable
        delayLongPress={600}
        onPress={props.onPress?.bind(null, props.data) || OnPress}
        onLongPress={() => {
          haptics.heavy();
          props.onLongPress?.(props.data);
        }}>
        <Wrapper bottomGap withPadding>
          <Header data={props.data} isPo={false} newCount={props.newCount} showForum />
          <View
            style={{
              flexDirection: threadDirection,
              justifyContent: "space-between",
              overflow: "hidden",
              flexWrap: "wrap",
            }}>
            <View
              style={{
                flex: 2,
                maxHeight: LINE_HEIGHT * (props.maxLine || 999),
                overflow: "hidden",
              }}>
              <HtmlView content={props.data.content as string} />
            </View>
            {props.data.images &&
              props.data.images[0] &&
              (["row", "row-reverse"].includes(threadDirection) ? (
                <ImageView
                  onPress={() => {
                    setPreviewUrl(previews[0]?.url);
                    setPreviews(previews);
                    navigation.navigate("PreviewModal");
                  }}
                  data={props.data.images[0]}
                  imageStyle={{
                    flex: 1,
                    width: imageSize,
                    height: "100%",
                    minHeight: imageSize,
                    marginTop: 2,
                    marginRight: threadDirection === "row-reverse" ? 4 : 0,
                    marginLeft: threadDirection === "row" ? 4 : 0,
                  }}
                  style={{}}
                />
              ) : (
                <ImageList images={props.data.images} previews={images} />
              ))}
          </View>
          {props.showReply && Boolean(props.data?.reply?.length) && (
            <View
              style={{
                backgroundColor: replyBackgroundColor,
                overflow: "hidden",
                marginTop: "1%",
                borderRadius: 4,
                borderColor,
                borderWidth: 1,
              }}>
              {(threadReplyReverse ? props.data.reply?.slice()?.reverse() : props.data.reply)?.map(
                (item, index) => (
                  <ReplyPost
                    key={item.id}
                    data={item}
                    width={width - Layout.postHorizontalPadding * 2}
                    onPress={() => {
                      navigation.navigate("Post", {
                        id: item.res as number,
                        title: `Po.${item.res}`,
                      });
                    }}
                    onLongPress={() => {
                      haptics.heavy();
                      props.onLongPress?.(props.data);
                    }}
                    onImagePress={(image) => {
                      setPreviewUrl(getImageUrl(image));
                      setPreviews(previews);
                      navigation.navigate("PreviewModal");
                    }}
                    maxHeight={LINE_HEIGHT * (props.maxLine || 999)}
                    level={1}
                    hideFeedBack
                  />
                )
              )}
            </View>
          )}
        </Wrapper>
      </Pressable>
    </PressableWrapper>
  );
}
