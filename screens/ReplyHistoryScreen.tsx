import { useNavigation } from "@react-navigation/native";
import { endOfDay, startOfDay, sub, add } from "date-fns";
import { atom, useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { StyleSheet, FlatList, FlatListProps } from "react-native";

import renderFooter from "./HomeScreen/renderFooter";

import { Reply, Image } from "@/api";
import { previewUrlAtom, previewsAtom, replyHistoryAtom } from "@/atoms";
import HistoryFloatingAction from "@/components/HistoryFloatingAction";
import { getImageUrl, getThumbnailUrl } from "@/components/Post/ImageView";
import ReplyPost from "@/components/Post/ReplyPost";
import { View } from "@/components/Themed";
import useHaptics from "@/hooks/useHaptics";

const rangeAtom = atom({
  start: startOfDay(sub(new Date(), { days: 7 })).getTime(),
  end: endOfDay(add(new Date(), { days: 7 })).getTime(),
});

export interface ReplyHistory extends Reply {
  createTime: number;
}

export default function ReplyHistoryScreen() {
  const [history] = useAtom<ReplyHistory[]>(replyHistoryAtom);
  const [filteredHistory, setFilteredHistory] = useState<ReplyHistory[]>([]);
  const [range, setRange] = useAtom(rangeAtom);
  const setPreviews = useSetAtom(previewsAtom);
  const setPreviewUrl = useSetAtom(previewUrlAtom);
  const navigation = useNavigation();
  const haptics = useHaptics();

  const updateHistory = () => {
    setFilteredHistory(
      history?.filter(({ createTime }) => {
        return createTime >= range.start && createTime < range.end;
      }) ?? []
    );
  };

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

  useEffect(() => {
    updateHistory();
  }, [range, history]);

  return (
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
