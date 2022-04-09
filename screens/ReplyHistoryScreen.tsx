import { useNavigation } from "@react-navigation/native";
import { endOfDay, startOfDay, sub, add } from "date-fns";
import { atom, useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { StyleSheet, FlatList, FlatListProps } from "react-native";

import renderFooter from "./HomeScreen/renderFooter";

import { Reply, Image } from "@/api";
import { previewIndexAtom, previewsAtom, replyHistoryAtom } from "@/atoms";
import HistoryFloatingAction from "@/components/HistoryFloatingAction";
import { getImageUrl, getThumbnailUrl } from "@/components/Post/ImageView";
import ReplyPost from "@/components/Post/ReplyPost";
import { View } from "@/components/Themed";

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
  const setPreviewIndex = useSetAtom(previewIndexAtom);
  const navigation = useNavigation();

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
        onImagePress={(image: Image) => {
          setPreviews(
            item.images.map((item) => ({
              url: getImageUrl(item),
              originalUrl: getThumbnailUrl(item),
            }))
          );
          setPreviewIndex(item.images.findIndex((x) => x.url === image.url));
          navigation.navigate("PreviewModal");
        }}
      />
    );

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
