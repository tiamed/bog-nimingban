import { useAtom } from "jotai";
import { Pressable, PressableProps, StyleSheet } from "react-native";
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

  function ToastInfo(info: string) {
    Toast.show({
      type: "info",
      text1: info,
    });
  }

  function PressableBase(props: PressableProps) {
    return (
      <Pressable
        style={styles.item}
        android_ripple={{ color: cardInactiveColor, radius: 12 }}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        {...props}>
        {props.children}
      </Pressable>
    );
  }

  return (
    <>
      <PressableBase
        onLongPress={() => {
          ToastInfo("回复提醒");
        }}
        onPress={() => {
          Toast.show({
            type: "success",
            text1: canCheckUpdate ? "已关闭新回复提醒" : "已开启新回复提醒",
          });
          setCanCheckUpdate(!canCheckUpdate);
        }}>
        <Ionicon name="timer" color={canCheckUpdate ? cardActiveColor : cardInactiveColor} />
      </PressableBase>
      <PressableBase
        onLongPress={() => {
          ToastInfo("回复排序");
        }}
        onPress={() => {
          setOrder(Number(!order));
        }}>
        <Ionicon name={order ? "caret-down" : "caret-up"} color={cardActiveColor} />
      </PressableBase>
      <PressableBase
        onLongPress={() => {
          ToastInfo("只显示Po");
        }}
        onPress={toggle}>
        <Ionicon name="filter" color={postFiltered ? cardActiveColor : cardInactiveColor} />
      </PressableBase>
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    marginLeft: 20,
  },
});
