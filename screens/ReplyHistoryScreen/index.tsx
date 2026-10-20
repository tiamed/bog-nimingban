import { useNavigation } from "@react-navigation/native";
import { atom, useAtom, useSetAtom } from "jotai";
import { useMemo, useState } from "react";
import { StyleSheet, FlatList, FlatListProps } from "react-native";

import ActionModal from "./ActionModal";

import { Reply, Image } from "@/api";
import {
  previewUrlAtom,
  previewsAtom,
  replyHistoryAtom,
  showReplyHistoryActionModalAtom,
} from "@/atoms";
import HistoryFilterBar from "@/components/HistoryFilterBar";
import HistoryFloatingAction from "@/components/HistoryFloatingAction";
import { getImageUrl, getThumbnailUrl } from "@/components/Post/ImageView";
import ReplyPost from "@/components/Post/ReplyPost";
import { View } from "@/components/Themed";
import useHaptics from "@/hooks/useHaptics";
import useListSearch from "@/hooks/useListSearch";
import renderFooter from "@/screens/HomeScreen/renderFooter";
import { defaultHistoryRange, filterHistoryByRange, HistoryRange } from "@/utils/historyRange";

const rangeAtom = atom<HistoryRange>(defaultHistoryRange);
const queryAtom = atom("");

export interface ReplyHistory extends Reply {
  createTime: number;
}

export default function ReplyHistoryScreen() {
  const [history] = useAtom<ReplyHistory[]>(replyHistoryAtom);
  const [focusItem, setFocusItem] = useState<ReplyHistory>({} as ReplyHistory);
  const [range, setRange] = useAtom(rangeAtom);
  const [query, setQuery] = useAtom(queryAtom);
  const setPreviews = useSetAtom(previewsAtom);
  const setPreviewUrl = useSetAtom(previewUrlAtom);
  const setShowReplyHistoryActionModalAtom = useSetAtom(showReplyHistoryActionModalAtom);
  const navigation = useNavigation();
  const haptics = useHaptics();

  const rangedHistory = useMemo(() => filterHistoryByRange(history, range), [history, range]);
  const { results: filteredHistory, searching } = useListSearch(rangedHistory, query);

  const renderItem: FlatListProps<ReplyHistory>["renderItem"] = ({ item }) =>
    item && (
      <ReplyPost
        key={(item as unknown as Reply).id}
        data={item as unknown as Reply}
        po=""
        onPress={() => {
          const { id, res } = item as unknown as Reply;
          navigation.navigate("Post", {
            id: res || id,
            title: `Po.${res || id}`,
          });
        }}
        onLongPress={() => {
          haptics.heavy();
          setFocusItem(item);
          setShowReplyHistoryActionModalAtom(true);
        }}
        onImagePress={(image: Image) => {
          setPreviews(
            item.images.map((item) => ({
              url: getImageUrl(item),
              originalUrl: getThumbnailUrl(item),
            }))
          );
          setPreviewUrl(getImageUrl(image));
          navigation.navigate("PreviewModal");
        }}
        withPadding
      />
    );

  const keyExtractor = (item: ReplyHistory) => item.id.toString();

  return (
    <View style={styles.container}>
      <HistoryFilterBar
        range={range}
        query={query}
        count={filteredHistory.length}
        total={history?.length ?? 0}
        onClear={() => {
          setRange(defaultHistoryRange);
          setQuery("");
        }}
      />
      <FlatList
        style={styles.list}
        data={filteredHistory}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          renderFooter({
            loading: false,
            hasNoMore: true,
            empty: filteredHistory.length === 0,
            emptyText: searching ? "没有匹配的记录" : undefined,
          })
        }
      />
      <HistoryFloatingAction
        range={range}
        query={query}
        searchPlaceholder="搜索内容、串号或饼干"
        onChange={(nextRange, nextQuery) => {
          setRange(nextRange);
          setQuery(nextQuery);
        }}
      />
      <ActionModal item={focusItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  list: {
    width: "100%",
  },
});
