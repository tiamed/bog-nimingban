import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useAtom, useSetAtom } from "jotai";
import { Fragment, useContext, useMemo } from "react";
import { Dimensions, PixelRatio, Pressable, View } from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";

import { useThemeColor } from "../Themed";
import Header from "./Header";
import HtmlView from "./HtmlView";
import ImageView, { getImageUrl, getThumbnailUrl } from "./ImageView";
import ReplyPost from "./ReplyPost";
import Wrapper from "./Wrapper";

import { Post, Image } from "@/api";
import {
  lineHeightAtom,
  previewIndexAtom,
  previewsAtom,
  showThreadReplyAtom,
  threadDirectionAtom,
} from "@/atoms";
import { SizeContext } from "@/components/ThemeContextProvider";
import { useForumsIdMap } from "@/hooks/useForums";

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
  const forumsIdMap = useForumsIdMap();
  const setPreviews = useSetAtom(previewsAtom);
  const setPreviewIndex = useSetAtom(previewIndexAtom);
  const [threadDirection] = useAtom(threadDirectionAtom);
  const [LINE_HEIGHT] = useAtom(lineHeightAtom);
  const [showThreadReply] = useAtom(showThreadReplyAtom);
  const navigation = useNavigation();
  const replyBackgroundColor = useThemeColor({}, "replyBackground");
  const borderColor = useThemeColor({}, "border");
  const BASE_SIZE = useContext(SizeContext);
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
  const imageSize = useMemo(() => {
    const calculated =
      PixelRatio.roundToNearestPixel(BASE_SIZE * LINE_HEIGHT) * (props.maxLine || 999) - 2;
    return calculated < 150 ? calculated : 150;
  }, [props.maxLine, BASE_SIZE, LINE_HEIGHT]);

  const OnPress = () => {
    navigation.navigate("Post", {
      id: props.data.id as number,
      title: `${forumsIdMap.get(props.data.forum as number)} Po.${props.data.id}`,
    });
  };

  const PressableWrapper = props.gestureEnabled ? TapGestureHandler : Fragment;

  return (
    <PressableWrapper>
      <Pressable
        onPress={props.onPress?.bind(null, props.data) || OnPress}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          props.onLongPress?.(props.data);
        }}
        delayLongPress={800}>
        <Wrapper>
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
                maxHeight:
                  PixelRatio.roundToNearestPixel(BASE_SIZE * LINE_HEIGHT) * (props.maxLine || 999),
              }}>
              <HtmlView content={props.data.content as string} />
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
                  width: imageSize,
                  height: "100%",
                  minHeight: imageSize,
                  marginTop: 2,
                }}
                style={{}}
              />
            )}
          </View>
          {props.showReply && showThreadReply && props.data.reply && (
            <View
              style={{
                backgroundColor: replyBackgroundColor,
                overflow: "hidden",
                borderRadius: 4,
                borderColor,
                borderWidth: 1,
              }}>
              {props.data.reply?.map((item, index) => (
                <ReplyPost
                  key={item.id}
                  data={item}
                  width={width - 8}
                  onPress={() => {
                    navigation.navigate("Post", {
                      id: item.res as number,
                      title: `Po.${item.id}`,
                    });
                  }}
                  onLongPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    props.onLongPress?.(props.data);
                  }}
                  onImagePress={(image) => {
                    setPreviewIndex(images.findIndex((item) => item.url === image.url));
                    setPreviews(
                      images.map((item) => ({
                        url: getImageUrl(item),
                        originalUrl: getThumbnailUrl(item),
                      }))
                    );
                    navigation.navigate("PreviewModal");
                  }}
                  maxHeight={
                    PixelRatio.roundToNearestPixel(BASE_SIZE * LINE_HEIGHT) * (props.maxLine || 999)
                  }
                />
              ))}
            </View>
          )}
        </Wrapper>
      </Pressable>
    </PressableWrapper>
  );
}
