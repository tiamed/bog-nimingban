import { endOfDay, startOfDay, sub, add } from "date-fns";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { StyleSheet, FlatList, FlatListProps } from "react-native";

import renderFooter from "./HomeScreen/renderFooter";

import { Post } from "@/api";
import { historyAtom, maxLineAtom } from "@/atoms";
import HistoryFloatingAction from "@/components/HistoryFloatingAction";
import ThreadPost from "@/components/Post/ThreadPost";
import { View } from "@/components/Themed";

const rangeAtom = atom({
  start: startOfDay(sub(new Date(), { days: 7 })).getTime(),
  end: endOfDay(add(new Date(), { days: 7 })).getTime(),
});
export interface UserHistory extends Post {
  createTime: number;
  currentPage: number;
  position: number;
}

export default function BrowseHistoryScreen() {
  const [history] = useAtom<UserHistory[]>(historyAtom);
  const [maxLine] = useAtom(maxLineAtom);
  const [filteredHistory, setFilteredHistory] = useState<UserHistory[]>([]);
  const [range, setRange] = useAtom(rangeAtom);

  const updateHistory = () => {
    setFilteredHistory(
      history?.filter(({ createTime }) => {
        return createTime >= range.start && createTime < range.end;
      })
    );
  };

  const renderItem: FlatListProps<UserHistory>["renderItem"] = ({ item }) =>
    item && <ThreadPost key={item.id} data={item} maxLine={maxLine} />;

  useEffect(() => {
    updateHistory();
  }, [range, history]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredHistory}
        renderItem={renderItem}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => renderFooter(false, true)}
      />
      <HistoryFloatingAction
        start={range.start}
        end={range.end}
        onChange={(start, end) => {
          setRange({ start, end });
        }}
      />
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
});
