import React, { useEffect, useState } from "react";
import { decode } from "html-entities";
import HTMLView from "react-native-htmlview";
import { Dimensions, Linking, PixelRatio, Pressable } from "react-native";
import Collapsible from "react-native-collapsible";

import { View, Text } from "../Themed";
import useSize from "../../hooks/useSize";
import ReplyPostWithoutData from "./ReplyPostWithoutData";

const width = Dimensions.get("window").width;

export default function HtmlView(props: { content: string; level?: number }) {
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
      return <Quote key={index} data={quote} level={props.level || 1}></Quote>;
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

function Quote(props: { data: string; level: number }) {
  const { data } = props;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const BASE_SIZE = useSize();
  const quoteId = Number(data.replace(/>>Po\./g, ""));

  return (
    <Pressable
      onPress={() => {
        setIsCollapsed(!isCollapsed);
      }}
    >
      <View style={{ flexDirection: "column", margin: 2 }}>
        <View style={{ flexDirection: "row" }}>
          <Text
            lightColor="#666666"
            darkColor="#999999"
            style={{
              fontSize: BASE_SIZE * 0.8,
              lineHeight: PixelRatio.roundToNearestPixel(BASE_SIZE * 1.3),
              backgroundColor: "#eee",
              width: "auto",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {data}
          </Text>
        </View>
        <Collapsible
          key={quoteId}
          collapsed={isCollapsed}
          style={{
            borderWidth: 1,
            borderColor: "#eee",
          }}
          renderChildrenCollapsed={false}
          enablePointerEvents={true}
          collapsedHeight={0}
        >
          <ReplyPostWithoutData
            id={quoteId}
            width={width * 0.9 ** props.level}
            level={props.level + 1}
          ></ReplyPostWithoutData>
        </Collapsible>
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
          lineHeight: PixelRatio.roundToNearestPixel(BASE_SIZE * 1.3),
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
        lineHeight: PixelRatio.roundToNearestPixel(BASE_SIZE * 1.3),
        textAlign: "left",
      }}
    >
      {children}
    </Text>
  );
}
