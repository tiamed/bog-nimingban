import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { decode } from "html-entities";
import { useAtom } from "jotai";
import React, { useContext, useState } from "react";
import { Dimensions, Linking, PixelRatio, Pressable } from "react-native";
import Collapsible from "react-native-collapsible";
import HTMLView from "react-native-htmlview";

import ReplyPostWithoutData from "./ReplyPostWithoutData";

import { lineHeightAtom } from "@/atoms";
import { SizeContext } from "@/components/ThemeContextProvider";
import { View, Text, useThemeColor } from "@/components/Themed";
import Urls from "@/constants/Urls";

const width = Dimensions.get("window").width;

export default function HtmlView(props: { content: string; level?: number }) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  return <HTMLView value={props.content} renderNode={renderNode} />;

  function renderNode(node: any, index: number, siblings: any, parent: any, defaultRenderer: any) {
    if (node.attribs?.class === "quote") {
      const quote = decode(node.children[0].data || "");
      return <Quote key={index} data={quote} level={props.level || 1} />;
    }
    if (node.name === "a") {
      const isBog = /http:\/\/bog\.ac\/t\/([0-9]{0,})/.test(node.attribs?.href);
      if (isBog) {
        const id = node.attribs?.href.match(/http:\/\/bog\.ac\/t\/([0-9]{0,})/)?.[1];
        return (
          <Link
            key={index}
            href=""
            text={node.attribs?.href}
            onPress={() => {
              navigation.push("Post", {
                id: Number(id),
                title: `Po.${id}`,
              });
            }}
          />
        );
      }
      return <Link key={index} href={node.attribs?.href} />;
    }
    if (node.name === undefined) {
      const isBilibili = /(BV([a-zA-Z0-9]{10})|(AV[0-9]{1,}))/i.test(node.data?.trim());
      const isAcFun = /(ac([0-9]{1,}))/i.test(node.data?.trim());
      if (isBilibili) {
        return <Link key={index} href={`${Urls.bilibili}${node.data?.trim()}`} text={node.data} />;
      }
      if (isAcFun) {
        return <Link key={index} href={`${Urls.acfun}${node.data?.trim()}`} text={node.data} />;
      }

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
          easing="linear"
          align="top"
          duration={0}
          enablePointerEvents>
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

function Link(props: { href: string; text?: string; onPress?: () => void }) {
  const { href, text, onPress } = props;
  const BASE_SIZE = useContext(SizeContext);
  const [LINE_HEIGHT] = useAtom(lineHeightAtom);
  const highlight = useThemeColor({}, "highlight");
  const defaultOnPress = () => {
    Linking.openURL(href);
  };

  return (
    <Pressable onPress={onPress || defaultOnPress}>
      <Text
        style={{
          fontSize: BASE_SIZE,
          lineHeight: PixelRatio.roundToNearestPixel(BASE_SIZE * LINE_HEIGHT),
          color: highlight,
        }}>
        {text || href}
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
