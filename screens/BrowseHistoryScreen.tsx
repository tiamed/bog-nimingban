import { endOfDay, startOfDay, sub, add } from "date-fns";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { StyleSheet, FlatList, FlatListProps } from "react-native";

import renderFooter from "./HomeScreen/renderFooter";

import { ThreadPostConfigContext } from "@/Provider";
import { Post } from "@/api";
import { clickableAtom, expandableAtom, historyAtom, maxLineAtom } from "@/atoms";
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
  const [filteredHistory, setFilteredHistory] = useState<UserHistory[]>([]);
  const [history] = useAtom<UserHistory[]>(historyAtom);
  const [maxLine] = useAtom(maxLineAtom);
  const [range, setRange] = useAtom(rangeAtom);
  const [expandable] = useAtom(expandableAtom);
  const [clickable] = useAtom(clickableAtom);

  const updateHistory = () => {
    setFilteredHistory(
      history?.filter(({ createTime, id }) => {
        return createTime >= range.start && createTime < range.end;
      })
    );
  };

  const renderItem: FlatListProps<UserHistory>["renderItem"] = ({ item }) =>
    item && <ThreadPost key={item.id} data={item} maxLine={maxLine} />;

  const keyExtractor = (item: UserHistory) => item?.id.toString();

  useEffect(() => {
    updateHistory();
  }, [range, history]);

  return (
    <ThreadPostConfigContext.Provider value={{ expandable, clickable }}>
      <View style={styles.container}>
        <FlatList
          data={filteredHistory}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            renderFooter({
              loading: false,
              hasNoMore: true,
            })
          }
        />
        <HistoryFloatingAction
          start={range.start}
          end={range.end}
          onChange={(start, end) => {
            setRange({ start, end });
          }}
        />
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
});
