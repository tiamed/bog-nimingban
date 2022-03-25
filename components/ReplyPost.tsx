import HTMLView from "react-native-htmlview";
import { TouchableOpacity, Dimensions, Pressable, Linking } from "react-native";
import CachedImage from "expo-cached-image";
import { useAtom, useSetAtom } from "jotai";
import { decode } from "html-entities";

import { getPostById, Post } from "../api";
import { View, Text, useThemeColor } from "./Themed";
import { previewIndexAtom, previewsAtom } from "../atoms";
import { useNavigation } from "@react-navigation/native";
import { getImageUrl, getThumbnailUrl, renderTime } from "./ThreadPost";

export default function ReplyPost(props: {
  data: Partial<Post>;
  po: string;
  onPress?: () => void;
}) {
  const [previews] = useAtom(previewsAtom);
  const setPreviewIndex = useSetAtom(previewIndexAtom);
  const navigation = useNavigation();
  const borderColor = useThemeColor({}, "border");
  const isPo = props.data.cookie === props.po;

  return (
    <TouchableOpacity onPress={props.onPress}>
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
          <View style={{width: 120, flexDirection: "row"}}>
          {isPo && (
            <Text
              lightColor="white"
              darkColor="white"
              style={{
                fontSize: 11,
                backgroundColor: "#FC88B3",
                marginRight: 2,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              Po
            </Text>
          )}
          <Text
            lightColor="#FC88B3"
            darkColor="#FC88B3"
            style={{ fontSize: 11 }}
          >
            {props.data.cookie}
          </Text>
          </View>
          <Text style={{ fontSize: 11, flex: 1 }}>Po.{props.data.id}</Text>
          <Text
            lightColor="#666666"
            darkColor="#999999"
            style={{ fontSize: 11, flex: 2, textAlign: "right" }}
          >
            {renderTime(props.data.root, props.data.time)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "column",
            overflow: "hidden",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <HTMLView
              value={props.data.content as string}
              renderNode={renderNode}
            ></HTMLView>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {props.data?.images?.map((image) => (
              <TouchableOpacity
                key={image.url}
                onPress={() => {
                  setPreviewIndex(
                    previews.findIndex(
                      (item) => item.url === getImageUrl(image)
                    )
                  );
                  navigation.navigate("PreviewModal");
                }}
                style={{
                  width: "48%",
                  aspectRatio: 1,
                  borderColor: useThemeColor({}, "border"),
                  borderWidth: 1,
                  marginTop: 10,
                }}
              >
                <CachedImage
                  source={{ uri: getThumbnailUrl(image) }}
                  cacheKey={`${image.url}-thumb`}
                  resizeMode="contain"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
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
    if (node.name === "a") {
      return (
        <Pressable
          key={index}
          onPress={() => {
            Linking.openURL(node.attribs.href);
          }}
        >
          <Text
            lightColor="#FFB2A6"
            darkColor="#FFB2A6"
            style={{
              fontSize: 14,
            }}
          >
            {node.attribs.href}
          </Text>
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
