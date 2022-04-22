import { formatRelative, formatDistance, format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useContext } from "react";
import { View } from "react-native";
import { Badge } from "react-native-paper";

import { Post } from "@/api";
import { AccurateTimeFormatContext, SizeContext } from "@/components/ThemeContextProvider";
import { Text, useThemeColor } from "@/components/Themed";
import { useForumsIdMap } from "@/hooks/useForums";

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
  const badgeColor = useThemeColor({}, "badge");
  const accurate = useContext(AccurateTimeFormatContext);

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
            {props.data.cookie}
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
          {renderTime(props.data.root, props.data.time, accurate)}
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
                {props.data.name}
              </Text>
            </View>
          )}
          {Boolean(props.data.title) && (
            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
              <Text
                lightColor="white"
                darkColor="white"
                style={{
                  fontSize: BASE_SIZE * 0.8,
                  color: highlightColor,
                }}>
                {props.data.title}
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
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  height: BASE_SIZE * 0.8 + 8,
                }}>
                <Badge
                  size={BASE_SIZE}
                  style={{
                    backgroundColor: badgeColor,
                    marginRight: BASE_SIZE * 0.25,
                  }}>
                  {props.newCount}
                </Badge>
              </View>
            )}
            <Text
              lightColor="white"
              darkColor="white"
              style={{
                fontSize: BASE_SIZE * 0.8,
                backgroundColor: highlightColor,
                paddingVertical: 2,
                paddingHorizontal: 6,
                borderRadius: 8,
                overflow: "hidden",
              }}>
              {forumsIdMap.get(props.data.forum as number)}·
              {renderReplyCount(props.data.reply_count as number)}
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
  const now = Date.now();
  const timestamp = Date.parse(`${root} GMT+0000`) || time || now;
  const diff = now - timestamp;
  if (accurate) {
    return format(timestamp, "yyyy-MM-dd HH:mm:ss");
  }
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
