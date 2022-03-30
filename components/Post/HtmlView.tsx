import { decode } from "html-entities";
import HTMLView from "react-native-htmlview";
import { Linking, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { View, Text } from "../Themed";
import useSize from "../../hooks/useSize";

export default function HtmlView(props: { content: string }) {
  const navigation = useNavigation();
  const BASE_SIZE = useSize();

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
      return <Quote key={index} data={quote}></Quote>;
    }
    if (node.name === "a") {
      return <Link key={index} href={node.attribs?.href}></Link>;
    }
    if (node.name === undefined) {
      return <PureText key={index}>{decode(node.data)}</PureText>;
    }
    return <View key={index}>{defaultRenderer(node.children, parent)}</View>;
  }
}

function Quote(props: { data: string }) {
  const { data } = props;
  const BASE_SIZE = useSize();
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("QuoteModal", {
          id: Number(data.replace(/>>Po\./g, "")),
        });
      }}
    >
      <View style={{ flexDirection: "row", margin: 2 }}>
        <Text
          lightColor="#666666"
          darkColor="#999999"
          style={{
            fontSize: BASE_SIZE * 0.8,
            backgroundColor: "#eee",
            width: "auto",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {data}
        </Text>
      </View>
    </Pressable>
  );
}

function Link(props: { href: string }) {
  const { href } = props;
  const BASE_SIZE = useSize();

  return (
    <Pressable
      onPress={() => {
        Linking.openURL(href);
      }}
    >
      <Text
        lightColor="#FFB2A6"
        darkColor="#FFB2A6"
        style={{
          fontSize: BASE_SIZE,
        }}
      >
        {href}
      </Text>
    </Pressable>
  );
}

function PureText(props: { children: any }) {
  const { children } = props;

  const BASE_SIZE = useSize();

  return (
    <Text
      style={{
        fontSize: BASE_SIZE,
        lineHeight: BASE_SIZE * 1.3,
        textAlign: "left",
      }}
    >
      {children}
    </Text>
  );
}
