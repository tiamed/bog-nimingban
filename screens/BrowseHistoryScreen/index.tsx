import { atom, useAtom, useSetAtom } from "jotai";
import { useMemo, useState } from "react";
import { StyleSheet, FlatList, FlatListProps } from "react-native";

import renderFooter from "../HomeScreen/renderFooter";
import ActionModal from "./ActionModal";

import { ThreadPostConfigContext } from "@/Provider";
import { Post } from "@/api";
import {
  clickableAtom,
  expandableAtom,
  historyAtom,
  maxLineAtom,
  showBrowseHistoryActionModalAtom,
} from "@/atoms";
import HistoryFilterBar from "@/components/HistoryFilterBar";
import HistoryFloatingAction from "@/components/HistoryFloatingAction";
import ListSearchBar from "@/components/ListSearchBar";
import ThreadPost from "@/components/Post/ThreadPost";
import { View } from "@/components/Themed";
import useListSearch from "@/hooks/useListSearch";
import { defaultHistoryRange, filterHistoryByRange, HistoryRange } from "@/utils/historyRange";

const rangeAtom = atom<HistoryRange>(defaultHistoryRange);
export interface UserHistory extends Post {
  createTime: number;
  currentPage: number;
  position: number;
}

export default function BrowseHistoryScreen() {
  const [focusItem, setFocusItem] = useState<UserHistory>({} as UserHistory);
  const [history] = useAtom<UserHistory[]>(historyAtom);
  const [maxLine] = useAtom(maxLineAtom);
  const [range, setRange] = useAtom(rangeAtom);
  const [expandable] = useAtom(expandableAtom);
  const [clickable] = useAtom(clickableAtom);
  const setShowBrowseHistoryActionModal = useSetAtom(showBrowseHistoryActionModalAtom);

  const rangedHistory = useMemo(() => filterHistoryByRange(history, range), [history, range]);
  const { query, setQuery, results: filteredHistory, searching } = useListSearch(rangedHistory);

  const renderItem: FlatListProps<UserHistory>["renderItem"] = ({ item }) =>
    item && (
      <ThreadPost
        key={item.id}
        data={item}
        maxLine={maxLine}
        onLongPress={() => {
          setFocusItem(item);
          setShowBrowseHistoryActionModal(true);
        }}
      />
    );

  const keyExtractor = (item: UserHistory) => item?.id.toString();

  return (
    <ThreadPostConfigContext.Provider value={{ expandable, clickable }}>
      <View style={styles.container}>
        <ListSearchBar value={query} onChangeText={setQuery} />
        <HistoryFilterBar
          range={range}
          count={filteredHistory.length}
          total={history?.length ?? 0}
          onClear={setRange}
        />
        <FlatList
          style={styles.list}
          data={filteredHistory}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.5}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ListFooterComponent={() =>
            renderFooter({
              loading: false,
              hasNoMore: true,
              empty: filteredHistory.length === 0,
              emptyText: searching ? "没有匹配的记录" : undefined,
            })
          }
        />
        <HistoryFloatingAction range={range} onChange={setRange} />
        <ActionModal item={focusItem} />
      </View>
    </ThreadPostConfigContext.Provider>
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
