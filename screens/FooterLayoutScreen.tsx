import { useAtom } from "jotai";
import { StyleSheet, FlatList } from "react-native";

import Footer from "./PostScreen/Footer";

import { Post } from "@/api";
import { footerLayoutAtom } from "@/atoms";
import { View, Text, Button } from "@/components/Themed";
import { RootStackScreenProps } from "@/types";

export default function FooterLayoutScreen({
  route,
  navigation,
}: RootStackScreenProps<"FooterLayout">) {
  const [footerLayout] = useAtom<string[]>(footerLayoutAtom);
  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <Item key={item} name={item} index={index} />
  );
  const keyExtractor = (item: string) => item;

  return (
    <View style={styles.container}>
      <FlatList
        data={footerLayout}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>暂无屏蔽的串，板块列表中长按可屏蔽串</Text>
          </View>
        )}
      />
      <Footer visible id={0} mainPost={{} as Post} disabled />
    </View>
  );
}

function Item(props: { name: string; index: number }) {
  const { name, index } = props;
  const [footerLayout, setFooterLayout] = useAtom<string[], string[], void>(footerLayoutAtom);
  const moveUp = () => {
    if (index === 0) return;
    const previous = footerLayout[index - 1];
    const newLayout = [...footerLayout];
    newLayout[index - 1] = name;
    newLayout[index] = previous;
    setFooterLayout(newLayout);
  };

  const moveDown = () => {
    if (index === footerLayout.length - 1) return;
    const next = footerLayout[index + 1];
    const newLayout = [...footerLayout];
    newLayout[index + 1] = name;
    newLayout[index] = next;
    setFooterLayout(newLayout);
  };

  return (
    <View style={styles.item}>
      <Text style={styles.id}>{props.name}</Text>
      <Button style={styles.action} title="上移" onPress={moveUp} />
      <Button style={styles.action} title="下移" onPress={moveDown} />
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
