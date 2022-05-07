import { useAtom } from "jotai";
import { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, { ShadowDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { Forum } from "@/api";
import { forumsAtom, forumsOrderAtom, forumsVisibilityAtom } from "@/atoms";
import { Ionicon } from "@/components/Icon";
import { View, Text, Button, useThemeColor } from "@/components/Themed";
import { refreshForums } from "@/hooks/useForums";
import { RootStackScreenProps } from "@/types";

export default function ForumSettingsScreen({
  route,
  navigation,
}: RootStackScreenProps<"ForumSettings">) {
  const [forums, setForums] = useAtom<Forum[], Forum[], void>(forumsAtom);
  const [order, setOrder] = useAtom(forumsOrderAtom);
  const [visibility] = useAtom(forumsVisibilityAtom);
  const inactiveColor = useThemeColor({}, "inactive");
  const renderItem = ({ item, drag }: { item: number; drag: () => void; isActive: boolean }) => (
    <Item key={item} data={forums.find((f) => f.id === item)} drag={drag} />
  );
  const keyExtractor = (item: number) => item.toString();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            refreshForums(order, visibility, setForums);
            Toast.show({ type: "success", text1: "已更新版块索引" });
          }}>
          <Ionicon name="refresh" color={inactiveColor} />
        </TouchableOpacity>
      ),
    });
  }, [order, visibility, setForums]);

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <DraggableFlatList
          data={order}
          onDragEnd={({ data }) => {
            setOrder(data);
            setForums(data.map((id) => forums.find((f) => f.id === id)!));
          }}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </GestureHandlerRootView>
    </View>
  );
}

function Item(props: { data?: Forum; drag: () => void }) {
  const [visibility, setVisibility] = useAtom(forumsVisibilityAtom);
  const [forums, setForums] = useAtom<Forum[], Forum[], void>(forumsAtom);
  const activeColor = useThemeColor({}, "active");
  const inactiveColor = useThemeColor({}, "inactive");
  return (
    <ShadowDecorator>
      <TouchableOpacity style={styles.item} onLongPress={props.drag}>
        <Text style={styles.id}>{props.data?.name}</Text>
        <View style={styles.actions}>
          <Button
            style={styles.action}
            color={props.data?.hide ? inactiveColor : activeColor}
            title={props.data?.hide ? "显示" : "隐藏"}
            onPress={() => {
              setVisibility({ ...visibility, [Number(props.data?.id)]: !props.data?.hide });
              setForums(
                forums.map((f) => ({ ...f, hide: f.id === props.data?.id ? !f.hide : f.hide }))
              );
            }}
          />
        </View>
      </TouchableOpacity>
    </ShadowDecorator>
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
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
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
