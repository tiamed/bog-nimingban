import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { StyleSheet, FlatList, Alert } from "react-native";

import { blackListPostsAtom } from "@/atoms";
import { View, Text, Button } from "@/components/Themed";
import { RootTabScreenProps } from "@/types";

export default function FavoriteScreen({ route, navigation }: RootTabScreenProps<"Favorite">) {
  const [blackListPosts] = useAtom<number[]>(blackListPostsAtom);

  return (
    <View style={styles.container}>
      <FlatList
        data={blackListPosts}
        renderItem={({ item }) => <Item key={item} id={item} />}
        keyExtractor={(item) => item.toString()}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>暂无屏蔽的串，板块列表中长按可屏蔽串</Text>
          </View>
        )}
      />
    </View>
  );
}

function Item(props: { id: number }) {
  const navigation = useNavigation();
  const [blackListPosts, setBlackListPosts] = useAtom<number[], number[], void>(blackListPostsAtom);
  return (
    <View style={styles.item}>
      <Text style={styles.id}>{props.id}</Text>
      <Button
        style={styles.action}
        title="查看"
        onPress={() => {
          navigation.navigate("Post", {
            id: props.id,
            title: `Po.${props.id}`,
          });
        }}
      />
      <Button
        style={styles.action}
        title="移除"
        onPress={() => {
          Alert.alert("移除", "确定移除吗？", [
            {
              text: "取消",
            },
            {
              text: "确定",
              onPress: () => {
                setBlackListPosts(blackListPosts.filter((item) => item !== props.id));
              },
            },
          ]);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  id: {
    width: "60%",
    fontSize: 16,
  },
  action: {
    marginLeft: 20,
    fontSize: 16,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  emptyText: {
    fontSize: 16,
  },
});
