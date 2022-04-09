import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { decode } from "html-entities";
import { useAtom } from "jotai";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, Linking, PixelRatio, Pressable } from "react-native";
import HTMLView from "react-native-htmlview";
import { useCollapsible, AnimatedSection } from "reanimated-collapsible-helpers";

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
  const BASE_SIZE = useContext(SizeContext);
  const [LINE_HEIGHT] = useAtom(lineHeightAtom);
  const [loadingText, setLoadingText] = useState("");
  const quoteId = Number(data.replace(/>>Po\./g, ""));
  const { animatedHeight, onPress, onLayout, state } = useCollapsible({ duration: 200 });
  useEffect(() => {
    if (state === "expanded") {
      setTimeout(() => {
        setLoadingText("");
      }, 300);
    }
  }, [state]);

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        alignContent: "center",
        marginVertical: 2,
      }}>
      <View
        style={{
          flexDirection: "row",
          minWidth: "100%",
        }}>
        <Pressable
          hitSlop={50}
          onPress={() => {
            if (state === "collapsed") {
              setLoadingText("加载中");
            }
            onPress();
          }}>
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
        </Pressable>
        <Text
          style={{
            fontSize: BASE_SIZE * 0.8,
            lineHeight: PixelRatio.roundToNearestPixel(BASE_SIZE * LINE_HEIGHT) - 4,
            marginLeft: 5,
          }}>
          {loadingText}
        </Text>
      </View>
      <AnimatedSection
        key={quoteId}
        animatedHeight={animatedHeight}
        onLayout={onLayout}
        state={state}
        style={{
          borderWidth: 1,
          borderColor: "#eee",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
        {state === "expanded" && (
          <ReplyPostWithoutData
            id={quoteId}
            width={width - 20 * props.level}
            level={props.level + 1}
            onLoaded={() => {
              setTimeout(() => {
                setLoadingText("");
              }, 300);
            }}
          />
        )}
      </AnimatedSection>
    </View>
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
        minWidth: "100%",
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
