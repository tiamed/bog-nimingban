import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { StyleSheet, FlatList } from "react-native";

import renderFooter from "./HomeScreen/renderFooter";

import { Reply } from "@/api";
import { replyHistoryAtom } from "@/atoms";
import HistoryFloatingAction from "@/components/HistoryFloatingAction";
import ReplyPost from "@/components/Post/ReplyPost";
import { View } from "@/components/Themed";

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
                const { id, res } = item as unknown as Reply;
                navigation.navigate("Post", {
                  id: res || id,
                  title: `Po.${res || id}`,
                });
              }}
            />
          )
        }
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => renderFooter(false, true)}
      />
      <HistoryFloatingAction />
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
