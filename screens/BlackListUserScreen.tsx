import { useAtom } from "jotai";
import { StyleSheet, FlatList, Alert } from "react-native";

import { blackListCookiesAtom } from "@/atoms";
import { View, Text, Button } from "@/components/Themed";
import { RootStackScreenProps } from "@/types";

export default function BlackListUserScreen({
  route,
  navigation,
}: RootStackScreenProps<"BlackList">) {
  const [blackListCookies] = useAtom<string[]>(blackListCookiesAtom);
  const renderItem = ({ item }: { item: string }) => <Item key={item} id={item} />;
  const keyExtractor = (item: string) => item.toString();

  return (
    <View style={styles.container}>
      <FlatList
        data={blackListCookies}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>暂无屏蔽饼干，首页长按串可进行屏蔽</Text>
          </View>
        )}
      />
    </View>
  );
}

function Item(props: { id: string }) {
  const [blackListCookies, setBlackListCookies] = useAtom<string[], string[], void>(
    blackListCookiesAtom
  );
  return (
    <View style={styles.item}>
      <Text style={styles.id}>{props.id}</Text>
      <View style={styles.actions}>
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
                  setBlackListCookies(blackListCookies.filter((item) => item !== props.id));
                },
              },
            ]);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  id: {
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
  },
  action: {
    marginLeft: 20,
    fontSize: 16,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
  },
});
