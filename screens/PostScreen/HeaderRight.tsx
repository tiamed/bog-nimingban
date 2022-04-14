import { useAtom } from "jotai";
import { Pressable, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import { canCheckUpdateAtom, orderAtom, postFilteredAtom } from "@/atoms";
import { Ionicon } from "@/components/Icon";
import { useThemeColor } from "@/components/Themed";

export default function HeaderRight() {
  const activeColor = useThemeColor({}, "active");
  const inactiveColor = useThemeColor({}, "inactive");
  const [postFiltered, setPostFiltered] = useAtom(postFilteredAtom);
  const [order, setOrder] = useAtom(orderAtom);
  const [canCheckUpdate, setCanCheckUpdate] = useAtom(canCheckUpdateAtom);

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
        <Ionicon name="timer" color={canCheckUpdate ? activeColor : inactiveColor} />
      </Pressable>
      <Pressable
        style={styles.item}
        onPress={() => {
          setOrder(Number(!order));
        }}>
        <Ionicon name={order ? "caret-down" : "caret-up"} color={activeColor} />
      </Pressable>
      <Pressable
        style={styles.item}
        onPress={() => {
          setPostFiltered(!postFiltered);
        }}>
        <Ionicon name="filter" color={postFiltered ? activeColor : inactiveColor} />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    marginLeft: 20,
  },
});
