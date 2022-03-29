import { decode } from "html-entities";
import HTMLView from "react-native-htmlview";
import { Linking, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { View, Text } from "../Themed";

export default function HtmlView(props: { content: string }) {
  const navigation = useNavigation();

  return <HTMLView value={props.content} renderNode={renderNode}></HTMLView>;

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
