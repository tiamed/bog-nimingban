import { decode } from "html-entities";
import { useAtom } from "jotai";
import React, { useContext, useState } from "react";
import { Dimensions, Linking, PixelRatio, Pressable } from "react-native";
import Collapsible from "react-native-collapsible";
import HTMLView from "react-native-htmlview";

import ReplyPostWithoutData from "./ReplyPostWithoutData";

import { lineHeightAtom } from "@/atoms";
import { SizeContext } from "@/components/ThemeContextProvider";
import { View, Text } from "@/components/Themed";

const width = Dimensions.get("window").width;

export default function HtmlView(props: { content: string; level?: number }) {
  return <HTMLView value={props.content} renderNode={renderNode} />;

  function renderNode(node: any, index: number, siblings: any, parent: any, defaultRenderer: any) {
    if (node.attribs?.class === "quote") {
      const quote = decode(node.children[0].data || "");
      return <Quote key={index} data={quote} level={props.level || 1} />;
    }
    if (node.name === "a") {
      return <Link key={index} href={node.attribs?.href} />;
    }
    if (node.name === undefined) {
      return <PureText key={index}>{decode(node.data)}</PureText>;
    }
    if (node.name === "br" && node?.next?.name === "br") {
      return <EmptyLine key={index} />;
    }
    return <View key={index}>{defaultRenderer(node.children, parent)}</View>;
  }
}

function Quote(props: { data: string; level: number }) {
  const { data } = props;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const BASE_SIZE = useContext(SizeContext);
  const [LINE_HEIGHT] = useAtom(lineHeightAtom);
  const quoteId = Number(data.replace(/>>Po\./g, ""));

  return (
    <Pressable
      onPress={() => {
        setIsCollapsed(!isCollapsed);
      }}>
      <View style={{ flexDirection: "column", margin: 2 }}>
        <View style={{ flexDirection: "row" }}>
          <Text
            lightColor="#666666"
            darkColor="#999999"
            style={{
              fontSize: BASE_SIZE * 0.8,
              lineHeight: PixelRatio.roundToNearestPixel(BASE_SIZE * LINE_HEIGHT) - 4,
              backgroundColor: "#eee",
              width: "auto",
              borderRadius: 2,
              overflow: "hidden",
            }}>
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
          enablePointerEvents
          collapsedHeight={0}>
          <ReplyPostWithoutData
            id={quoteId}
            width={width * 0.9 ** props.level}
            level={props.level + 1}
          />
        </Collapsible>
      </View>
    </Pressable>
  );
}

function Link(props: { href: string }) {
  const { href } = props;
  const BASE_SIZE = useContext(SizeContext);
  const [LINE_HEIGHT] = useAtom(lineHeightAtom);

  return (
    <Pressable
      onPress={() => {
        Linking.openURL(href);
      }}>
      <Text
        lightColor="#FFB2A6"
        darkColor="#FFB2A6"
        style={{
          fontSize: BASE_SIZE,
          lineHeight: PixelRatio.roundToNearestPixel(BASE_SIZE * LINE_HEIGHT),
        }}>
        {href}
      </Text>
    </Pressable>
  );
}

function PureText(props: { children: any }) {
  const { children } = props;

  const BASE_SIZE = useContext(SizeContext);
  const [LINE_HEIGHT] = useAtom(lineHeightAtom);

  return (
    <Text
      style={{
        fontSize: BASE_SIZE,
        lineHeight: PixelRatio.roundToNearestPixel(BASE_SIZE * LINE_HEIGHT),
        textAlign: "left",
      }}>
      {children}
    </Text>
  );
}

function EmptyLine() {
  const BASE_SIZE = useContext(SizeContext);
  const [LINE_HEIGHT] = useAtom(lineHeightAtom);

  return (
    <View
      style={{
        height: PixelRatio.roundToNearestPixel(BASE_SIZE * LINE_HEIGHT),
      }}
    />
  );
}
