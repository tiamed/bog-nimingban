import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { StyleSheet, FlatList, Alert, TouchableOpacity } from "react-native";

import { blackListWordsAtom } from "@/atoms";
import { Octicon } from "@/components/Icon";
import InputModal from "@/components/InputModal";
import { View, Text, Button, useThemeColor } from "@/components/Themed";
import { RootStackScreenProps } from "@/types";

export default function BlackListWordScreen({
  route,
  navigation,
}: RootStackScreenProps<"BlackListWord">) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [blackListWords, setBlackListWords] = useAtom<string[], string[], void>(blackListWordsAtom);
  const cardInactiveColor = useThemeColor({}, "cardInactive");

  const renderItem = ({ item }: { item: string }) => <Item key={item} id={item} />;
  const keyExtractor = (item: string) => item.toString();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
          }}>
          <Octicon name="plus-circle" color={cardInactiveColor} />
        </TouchableOpacity>
      ),
    });
  }, [cardInactiveColor, navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={blackListWords}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>暂无屏蔽词</Text>
          </View>
        )}
      />
      <InputModal
        visible={visible}
        initialValue={text}
        title="添加屏蔽词"
        placeholder="支持正则，如：^\d+(?:\.\d+){2}$"
        onConfirm={async (value) => {
          if (value) {
            setBlackListWords([...blackListWords, value]);
          }
          setText("");
        }}
        onDismiss={() => setVisible(false)}
      />
    </View>
  );
}

function Item(props: { id: string }) {
  const [blackListWords, setBlackListWords] = useAtom<string[], string[], void>(blackListWordsAtom);
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
                  setBlackListWords(blackListWords.filter((item) => item !== props.id));
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
