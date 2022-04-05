import { StyleSheet, FlatList } from "react-native";
import { useAtom } from "jotai";

import { View } from "../components/Themed";
import { Reply } from "../api";
import ReplyPost from "../components/Post/ReplyPost";
import { renderFooter } from "./HomeScreen";
import { replyHistoryAtom, maxLineAtom } from "../atoms";
import { useNavigation } from "@react-navigation/native";

export interface ReplyHistory extends Reply {
  createTime: number;
}

export default function ReplyHistoryScreen() {
  const [history] = useAtom<ReplyHistory[]>(replyHistoryAtom);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={({ item }) =>
          item && (
            <ReplyPost
              key={(item as unknown as Reply).id}
              data={item as unknown as Reply}
              po=""
              onPress={() => {
                navigation.navigate("Post", {
                  id: item.res,
                  title: `Po.${item.res}`,
                });
              }}
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
