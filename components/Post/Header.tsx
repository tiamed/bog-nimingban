import { formatRelative, formatDistance } from "date-fns";
import { zhCN } from "date-fns/locale";

import { Post } from "../../api";
import useForums, { useForumsIdMap } from "../../hooks/useForums";
import useSize from "../../hooks/useSize";
import { View, Text } from "../Themed";

export default function Header(props: {
  data: Partial<Post>;
  isPo?: boolean;
  showForum?: boolean;
}) {
  const forums = useForums();
  const forumsIdMap = useForumsIdMap();
  const BASE_SIZE = useSize();

  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <View style={{ width: "32%", flexDirection: "row" }}>
        {props.isPo && (
          <Text
            lightColor="white"
            darkColor="white"
            style={{
              fontSize: BASE_SIZE * 0.8,
              backgroundColor: "#FC88B3",
              marginRight: 2,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            Po
          </Text>
        )}
        <Text
          lightColor="#FC88B3"
          darkColor="#FC88B3"
          style={{ fontSize: BASE_SIZE * 0.8 }}
        >
          {props.data.cookie}
        </Text>
      </View>
      <Text style={{ fontSize: BASE_SIZE * 0.8, flex: 1 }}>
        Po.{props.data.id}
      </Text>
      <View style={{ flex: 2, flexDirection: "column" }}>
        <Text
          lightColor="#666666"
          darkColor="#999999"
          style={{ fontSize: BASE_SIZE * 0.8, flex: 2, textAlign: "right" }}
        >
          {renderTime(props.data.root, props.data.time)}
        </Text>
        {props.showForum && props.data.reply_count !== undefined && (
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Text
              lightColor="white"
              darkColor="white"
              style={{
                fontSize: BASE_SIZE * 0.8,
                backgroundColor: "#FD4C5D",
                padding: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
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
