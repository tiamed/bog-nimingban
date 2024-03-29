import { useContext } from "react";
import { View, StyleSheet } from "react-native";

import { Octicon } from "../Icon";

import { LayoutConfigContext, SizeContext } from "@/Provider";
import { Post } from "@/api";
import { Text, useThemeColor } from "@/components/Themed";
import { useForumsIdMap } from "@/hooks/useForums";
import { formatTime, normalizeHtml } from "@/utils/format";

function getCookieText(
  post: Partial<Post>,
  options?: {
    isAnon?: boolean;
    isEmoji?: boolean;
    anonText?: string;
  }
) {
  if (options?.isAnon) {
    return options.anonText ?? post.cookie;
  }
  if (options?.isEmoji) {
    return post.emoji ?? post.cookie;
  }
  return post.cookie;
}

export default function Header(props: {
  data: Partial<Post>;
  isPo?: boolean;
  showForum?: boolean;
  newCount?: number;
}) {
  const forumsIdMap = useForumsIdMap();
  const BASE_SIZE = useContext(SizeContext);
  const tintColor = useThemeColor({}, "tint");
  const highlightColor = useThemeColor({}, "highlight");
  const highlighBackgroundColor = useThemeColor({}, "highlightBackground");
  const { accurateTimeFormat, emojiCookieMode, anonCookieMode, anonCookieText } =
    useContext(LayoutConfigContext);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
        }}>
        <View
          style={{
            width: "32%",
            flexDirection: "row",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}>
          {props.isPo && (
            <Text
              lightColor="white"
              darkColor="white"
              style={{
                fontSize: BASE_SIZE * 0.8,
                backgroundColor: tintColor,
                marginRight: 2,
                borderRadius: 2,
                overflow: "hidden",
              }}>
              Po
            </Text>
          )}
          <Text
            style={{
              fontSize: BASE_SIZE * 0.8,
              color: props.data.admin ? highlightColor : tintColor,
              fontWeight: props.data.admin ? "bold" : "normal",
            }}>
            {getCookieText(props.data, {
              isAnon: anonCookieMode,
              isEmoji: emojiCookieMode,
              anonText: anonCookieText,
            })}
          </Text>
        </View>
        <Text style={{ fontSize: BASE_SIZE * 0.8, flex: 1 }}>Po.{props.data.id}</Text>
        <Text
          lightColor="#666666"
          darkColor="#999999"
          style={{
            fontSize: BASE_SIZE * 0.8,
            flex: 2,
            textAlign: "right",
            fontVariant: ["tabular-nums"],
          }}>
          {renderTime(props.data.root, props.data.time, accurateTimeFormat)}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
        <View style={{ flexDirection: "column", flexWrap: "wrap", flexShrink: 1 }}>
          {Boolean(props.data.name) && (
            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
              <Text
                lightColor="white"
                darkColor="white"
                style={{
                  fontSize: BASE_SIZE * 0.8,
                  color: tintColor,
                }}>
                {normalizeHtml(props.data.name!)}
              </Text>
            </View>
          )}
          {Boolean(props.data.title) && (
            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
              <Text
                style={{
                  fontSize: BASE_SIZE * 0.8,
                  color: highlightColor,
                }}>
                {normalizeHtml(props.data.title!)}
              </Text>
            </View>
          )}
        </View>
        {props.showForum && props.data.reply_count !== undefined && (
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-start",
              alignItems: "flex-start",
            }}>
            {Number(props.newCount) > 0 && (
              <Text
                style={[
                  styles.tag,
                  {
                    fontSize: BASE_SIZE * 0.8,
                    backgroundColor: highlightColor,
                    color: "white",
                  },
                ]}>
                +{props.newCount}
              </Text>
            )}
            <Text
              style={[
                styles.tag,
                {
                  fontSize: BASE_SIZE * 0.8,
                  color: highlightColor,
                  backgroundColor: highlighBackgroundColor,
                },
              ]}>
              <Octicon name="comment" color={highlightColor} size={BASE_SIZE * 0.666} />
              &nbsp;
              {renderReplyCount(props.data.reply_count as number)}
            </Text>
            <Text
              style={[
                styles.tag,
                {
                  fontSize: BASE_SIZE * 0.8,
                  color: highlightColor,
                  backgroundColor: highlighBackgroundColor,
                  marginRight: 0,
                },
              ]}>
              {forumsIdMap.get(props.data.forum as number)}
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

export function renderTime(
  root: string | undefined,
  time: number | undefined,
  accurate: boolean = false
) {
  const timestamp = Date.parse(`${root} GMT+0000`) || time || Date.now();
  return formatTime(timestamp, accurate);
}

export function renderReplyCount(count: number) {
  return count < 1000 ? count : "999+";
}

const styles = StyleSheet.create({
  tag: {
    fontWeight: "bold",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 8,
  },
});
