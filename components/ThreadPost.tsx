import HTMLView from "react-native-htmlview";
import { formatRelative, formatDistance } from "date-fns";
import { zhCN } from "date-fns/locale";
import { TouchableOpacity, Dimensions, Pressable } from "react-native";
import CachedImage from "expo-cached-image";
import { useSetAtom } from "jotai";
import { decode } from "html-entities";

import { Post } from "../api";
import { View, Text, useThemeColor } from "./Themed";
import useForums, { useForumsIdMap } from "../hooks/useForums";
import { previewIndexAtom, previewsAtom } from "../atoms";
import { useNavigation } from "@react-navigation/native";
import { Image } from "../api/index";
import { useMemo } from "react";

export default function ThreadPost(props: { data: Partial<Post> }) {
  const forums = useForums();
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
      <View
        style={{
          width: Dimensions.get("window").width,
          alignSelf: "center",
          flexDirection: "column",
          padding: 8,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            lightColor="#FC88B3"
            darkColor="#FC88B3"
            style={{ fontSize: 11, width: 120 }}
          >
            {props.data.cookie}
          </Text>
          <Text style={{ fontSize: 11, flex: 1 }}>Po.{props.data.id}</Text>
          <Text
            lightColor="#666666"
            darkColor="#999999"
            style={{ fontSize: 11, flex: 2, textAlign: "right" }}
          >
            {renderTime(props.data.root, props.data.time)}
          </Text>
        </View>
        {props.data.reply_count !== undefined && (
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Text
              lightColor="white"
              darkColor="white"
              style={{
                fontSize: 11,
                backgroundColor: "#FD4C5D",
                padding: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {forumsIdMap.get(props.data.forum as number)}·
              {renderReplyCount(props.data.reply_count as number)}
            </Text>
          </View>
        )}
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
            <HTMLView
              value={props.data.content as string}
              renderNode={renderNode}
            ></HTMLView>
          </View>
          {props.data.images && props.data.images[0] && (
            <TouchableOpacity
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
            >
              <CachedImage
                source={{ uri: getThumbnailUrl(props.data.images[0]) }}
                cacheKey={`${props.data.images[0].url}-thumb`}
                resizeMode="contain"
                style={{
                  flex: 1,
                  width: 150,
                  height: "100%",
                  minHeight: 150,
                  marginTop: 10,
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  function renderNode(
    node: any,
    index: number,
    siblings: any,
    parent: any,
    defaultRenderer: any
  ) {
    if (node.attribs?.class === "quote") {
      const quote = decode(node.children[0].data);
      return (
        <Pressable
          key={index}
          onPress={() => {
            navigation.navigate("QuoteModal", {
              id: Number(quote.replace(/>>Po\./g, "")),
            });
          }}
        >
          <View style={{ flexDirection: "row", margin: 2 }}>
            <Text
              lightColor="#666666"
              darkColor="#999999"
              style={{
                fontSize: 11,
                backgroundColor: "#eee",
                width: "auto",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {quote}
            </Text>
          </View>
        </Pressable>
      );
    }
    if (node.name === undefined) {
      return (
        <Text key={index} style={{ fontSize: 14, lineHeight: 18 }}>
          {decode(node.data)}
        </Text>
      );
    }
    return <View key={index}>{defaultRenderer(node.children, parent)}</View>;
  }
}

export function renderTime(root: string | undefined, time: number | undefined) {
  const now = Date.now();
  const timestamp = Date.parse(`${root} GMT+0000`) || time || now;
  const diff = now - timestamp;
  if (diff < 1000 * 60 * 60 * 24) {
    return formatDistance(now, timestamp, {
      locale: zhCN,
      addSuffix: true,
    });
  }
  return formatRelative(timestamp, now, {
    locale: zhCN,
  });
}

export function renderReplyCount(count: number) {
  return count < 1000 ? count : "999+";
}

export function getThumbnailUrl(image: any) {
  return `http://bog.ac/image/thumb/${image.url}${image.ext}`;
}

export function getImageUrl(image: any) {
  return `http://bog.ac/image/large/${image.url}${image.ext}`;
}
