import { useAtom } from "jotai";
import { Pressable, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import { canCheckUpdateAtom, orderAtom } from "@/atoms";
import { Ionicon } from "@/components/Icon";
import { useThemeColor } from "@/components/Themed";
import usePostFiltered from "@/hooks/usePostFiltered";

export default function HeaderRight(props: { id: number }) {
  const [order, setOrder] = useAtom(orderAtom);
  const [canCheckUpdate, setCanCheckUpdate] = useAtom(canCheckUpdateAtom);

  const cardActiveColor = useThemeColor({}, "cardActive");
  const cardInactiveColor = useThemeColor({}, "cardInactive");
  const { result: postFiltered, toggle } = usePostFiltered(Number(props.id));

  return (
    <>
      <Pressable
        style={styles.item}
        onPress={() => {
          Toast.show({
            type: "success",
            text1: canCheckUpdate ? "已关闭新回复提醒" : "已开启新回复提醒",
          });
          setCanCheckUpdate(!canCheckUpdate);
        }}>
        <Ionicon name="timer" color={canCheckUpdate ? cardActiveColor : cardInactiveColor} />
      </Pressable>
      <Pressable
        style={styles.item}
        onPress={() => {
          setOrder(Number(!order));
        }}>
        <Ionicon name={order ? "caret-down" : "caret-up"} color={cardActiveColor} />
      </Pressable>
      <Pressable style={styles.item} onPress={toggle}>
        <Ionicon name="filter" color={postFiltered ? cardActiveColor : cardInactiveColor} />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    marginLeft: 20,
  },
});
