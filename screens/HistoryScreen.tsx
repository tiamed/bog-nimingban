import { StyleSheet, FlatList } from "react-native";
import { useAtom } from "jotai";

import { View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { Post } from "../api";
import ThreadPost from "../components/Post/ThreadPost";
import { renderFooter } from "./HomeScreen";
import { historyAtom } from "../atoms";

export interface UserHistory extends Post {
  createTime: number;
  currentPage: number;
}

export default function HistoryScreen({
  route,
  navigation,
}: RootTabScreenProps<"History">) {
  const [history] = useAtom<UserHistory[]>(historyAtom);

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={({ item }) =>
          item && (
            <ThreadPost
              key={(item as unknown as Post).id}
              data={item as unknown as Post}
              maxLine={10}
            />
          )
        }
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter.bind(null, false, true)}
      ></FlatList>
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
