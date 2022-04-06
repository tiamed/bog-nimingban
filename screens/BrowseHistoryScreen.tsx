import { useAtom } from "jotai";
import { StyleSheet, FlatList } from "react-native";

import renderFooter from "./HomeScreen/renderFooter";

import { Post } from "@/api";
import { historyAtom, maxLineAtom } from "@/atoms";
import ThreadPost from "@/components/Post/ThreadPost";
import { View } from "@/components/Themed";

export interface UserHistory extends Post {
  createTime: number;
  currentPage: number;
}

export default function BrowseHistoryScreen() {
  const [history] = useAtom<UserHistory[]>(historyAtom);
  const [maxLine] = useAtom(maxLineAtom);
  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={({ item }) =>
          item && (
            <ThreadPost
              key={(item as unknown as Post).id}
              data={item as unknown as Post}
              maxLine={maxLine}
            />
          )
        }
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => renderFooter(false, true)}
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
