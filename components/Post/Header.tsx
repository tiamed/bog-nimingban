import { formatRelative, formatDistance } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useContext } from "react";

import { Post } from "@/api";
import { SizeContext } from "@/components/ThemeContextProvider";
import { View, Text, useThemeColor } from "@/components/Themed";
import { useForumsIdMap } from "@/hooks/useForums";

export default function Header(props: {
  data: Partial<Post>;
  isPo?: boolean;
  showForum?: boolean;
}) {
  const forumsIdMap = useForumsIdMap();
  const BASE_SIZE = useContext(SizeContext);
  const tintColor = useThemeColor({}, "tint");
  const highlightColor = useThemeColor({}, "highlight");

  return (
    <View
      style={{
        flexDirection: "row",
      }}>
      <View style={{ width: "32%", flexDirection: "row" }}>
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
        <Text style={{ fontSize: BASE_SIZE * 0.8, color: tintColor }}>{props.data.cookie}</Text>
      </View>
      <Text style={{ fontSize: BASE_SIZE * 0.8, flex: 1 }}>Po.{props.data.id}</Text>
      <View style={{ flex: 2, flexDirection: "column" }}>
        <Text
          lightColor="#666666"
          darkColor="#999999"
          style={{ fontSize: BASE_SIZE * 0.8, flex: 2, textAlign: "right" }}>
          {renderTime(props.data.root, props.data.time)}
        </Text>
        {props.showForum && props.data.reply_count !== undefined && (
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Text
              lightColor="white"
              darkColor="white"
              style={{
                fontSize: BASE_SIZE * 0.8,
                backgroundColor: highlightColor,
                padding: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 8,
                overflow: "hidden",
              }}>
              {forumsIdMap.get(props.data.forum as number)}·
              {renderReplyCount(props.data.reply_count as number)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export function renderTime(root: string | undefined, time: number | undefined) {
  const now = Date.now();
  const timestamp = Date.parse(`${root} GMT+0000`) || time || now;
  const diff = now - timestamp;
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
