import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Color from "color";
import { decode } from "html-entities";
import { useAtom } from "jotai";
import parse, { HTMLElement } from "node-html-parser";
import React, { useContext, useEffect, useMemo, useState, Fragment } from "react";
import { Linking, Pressable, TextStyle, View } from "react-native";
import HTMLView from "react-native-htmlview";
import { useCollapsible, AnimatedSection } from "reanimated-collapsible-helpers";
import { useIsMounted } from "usehooks-ts";

import { BogIcon } from "../Icon";
import ReplyPostWithoutData from "./ReplyPostWithoutData";

import { SizeContext } from "@/Provider";
import { ThreadPostConfigContext } from "@/Provider/Layout";
import { autoExpandAtom, lineHeightAtom, responsiveWidthAtom } from "@/atoms";
import { Text, useThemeColor } from "@/components/Themed";
import Layout from "@/constants/Layout";
import Urls from "@/constants/Urls";

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
      const isBilibili = /(BV([a-zA-Z0-9]{10})|(AV[0-9]{1,}))$/i.test(node.data?.trim());
      const isAcFun = /(ac([0-9]{1,}))$/i.test(node.data?.trim());

      if (isBilibili) {
        return <Link key={index} href={`${Urls.bilibili}${node.data?.trim()}`} text={node.data} />;
      }

      if (isAcFun) {
        return <Link key={index} href={`${Urls.acfun}${node.data?.trim()}`} text={node.data} />;
      }

      return (
        <TextWithHidden key={index} style={parseStyle(node.parent?.attribs)}>
          {decode(node.data)}
        </TextWithHidden>
      );
    }

    if (node.name === "b") {
      return <Dice key={index}>{decode(node.children[0].data || "")}</Dice>;
    }

    if (node.name === "br" && node?.next?.name === "br") {
      return <EmptyLine key={index} />;
    }

    return <View key={index}>{defaultRenderer(node.children, parent)}</View>;
  }
}

function Quote(props: { data: string; level: number }) {
  const { data } = props;
  const quoteReferenceColor = useThemeColor({}, "quoteReference");
  const BASE_SIZE = useContext(SizeContext);
  const { expandable } = useContext(ThreadPostConfigContext);
  const [LINE_HEIGHT] = useAtom(lineHeightAtom);
  const [responsiveWidth] = useAtom(responsiveWidthAtom);
  const [autoExpand] = useAtom(autoExpandAtom);
  const [loadingText, setLoadingText] = useState("");
  const quoteId = Number(data.replace(/>>Po\./g, ""));
  const replyWidth =
    responsiveWidth -
    2 -
    Layout.postHorizontalPadding * 2 -
    (props.level - 1) * (Layout.postHorizontalPaddingSecondary * 2 + 2);

  const { animatedHeight, onPress, onLayout, state } = useCollapsible({ duration: 200 });
  const isMounted = useIsMounted();

  const borderBottomRadius = useMemo(() => {
    return state === "expanded" ? 0 : 2;
  }, [state]);

  useEffect(() => {
    if (state === "expanded") {
      setTimeout(() => {
        if (isMounted()) {
          setLoadingText("");
        }
      }, 300);
    }
  }, [state]);

  useEffect(() => {
    if (autoExpand && props.level < 2) {
      setLoadingText("加载中...");
      onPress();
    }
  }, [autoExpand]);

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
        <QuoteReference>
          <Text
            lightColor="#666666"
            darkColor="#999999"
            style={{
              fontSize: BASE_SIZE * 0.8,
              lineHeight: LINE_HEIGHT - 4,
              paddingHorizontal: 2,
              backgroundColor: quoteReferenceColor,
              width: "auto",
              borderRadius: 2,
              borderBottomLeftRadius: borderBottomRadius,
              borderBottomRightRadius: borderBottomRadius,
              overflow: "hidden",
            }}>
            {data}
          </Text>
        </QuoteReference>
        <Text
          style={{
            fontSize: BASE_SIZE * 0.8,
            lineHeight: LINE_HEIGHT - 4,
            marginLeft: 5,
          }}>
          {loadingText}
        </Text>
      </View>
      {expandable && (
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
          {(autoExpand || state === "expanded") && (
            <ReplyPostWithoutData
              id={quoteId}
              width={replyWidth}
              level={props.level + 1}
              onLoaded={() => {
                setTimeout(() => {
                  if (isMounted()) {
                    setLoadingText("");
                  }
                }, 200);
              }}
            />
          )}
        </AnimatedSection>
      )}
    </View>
  );

  function QuoteReference(props: { children: any }) {
    const [responsiveWidth] = useAtom(responsiveWidthAtom);
    return expandable ? (
      <Pressable
        hitSlop={{
          right: responsiveWidth,
          top: 2,
          bottom: 2,
          left: 2,
        }}
        onPress={() => {
          if (state === "collapsed") {
            setLoadingText("加载中");
          }
          onPress();
        }}>
        {props.children}
      </Pressable>
    ) : (
      props.children
    );
  }
}

function Link(props: { href: string; text?: string; onPress?: () => void }) {
  const { href, text, onPress } = props;
  const BASE_SIZE = useContext(SizeContext);
  const { clickable } = useContext(ThreadPostConfigContext);
  const [LINE_HEIGHT] = useAtom(lineHeightAtom);
  const highlight = useThemeColor({}, "highlight");
  const defaultOnPress = () => {
    Linking.openURL(href);
  };

  return (
    <Pressable onPress={onPress || defaultOnPress} disabled={!clickable}>
      <Text
        style={{
          fontSize: BASE_SIZE,
          lineHeight: LINE_HEIGHT,
          color: highlight,
        }}>
        {text || href}
      </Text>
    </Pressable>
  );
}

function HiddenText(props: { children: any }) {
  const [isHidden, setIsHidden] = useState(true);
  const textColor = useThemeColor({}, "text");
  return (
    <Text
      onPress={() => setIsHidden(!isHidden)}
      style={{
        opacity: isHidden ? 0 : 1,
        backgroundColor: isHidden ? textColor : undefined,
      }}>
      {props.children}
    </Text>
  );
}

function PureText(props: { children: any; style?: TextStyle }) {
  const { children } = props;

  const [LINE_HEIGHT] = useAtom(lineHeightAtom);

  return (
    <Text
      style={[
        props.style!,
        {
          lineHeight: LINE_HEIGHT,
          textAlign: "left",
          minWidth: "100%",
        },
      ]}>
      {children}
    </Text>
  );
}

function TextWithHidden(props: { children: any; style?: TextStyle }) {
  const { children } = props;

  const hiddenRegex = /\[h\](.*?)\[\/h\]/gi;

  if (hiddenRegex.test(children as string)) {
    const root = parse(
      children.replace(hiddenRegex, (_: string, match: string) => `<h>${match}</h>`)
    );
    const textNodes = root.childNodes.map((node) => ({
      hidden: (node as unknown as HTMLElement).rawTagName === "h",
      text: (node as unknown as HTMLElement).textContent,
    }));

    return (
      <PureText>
        {textNodes.map(({ hidden, text }, index) =>
          hidden ? (
            <HiddenText key={index}>{text}</HiddenText>
          ) : (
            <Fragment key={index}>{text}</Fragment>
          )
        )}
      </PureText>
    );
  }

  return <PureText>{children}</PureText>;
}

function Dice(props: { children: any }) {
  const { children } = props;
  const BASE_SIZE = useContext(SizeContext);
  const textColor = useThemeColor({}, "text");

  return (
    <PureText style={{ fontWeight: "bold", alignItems: "center" }}>
      <BogIcon name="roll" color={textColor} size={BASE_SIZE * 0.85} />
      &nbsp;
      {children}
    </PureText>
  );
}

function EmptyLine() {
  const [LINE_HEIGHT] = useAtom(lineHeightAtom);

  return (
    <View
      style={{
        height: LINE_HEIGHT,
      }}
    />
  );
}

function parseStyle(props?: { style?: string; color?: string }) {
  if (props?.style || props?.color) {
    let colorString = "";
    if (props.style) {
      const styles = props.style.split(";");
      colorString = /color:/i.test(styles[0]) ? styles[0].split(":")[1] : "";
    } else if (props.color) {
      colorString = props.color;
    }
    if (colorString) {
      try {
        const color = Color(colorString.trim()).hex();
        return { color };
      } catch (error) {
        console.error(error);
      }
    }
  }
  return undefined;
}
