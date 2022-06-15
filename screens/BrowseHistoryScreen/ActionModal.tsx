import { useAtom } from "jotai";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import Toast from "react-native-toast-message";

import { Post } from "@/api";
import { historyAtom, showBrowseHistoryActionModalAtom } from "@/atoms";
import Modal from "@/components/Modal";
import { Text, useThemeColor, View } from "@/components/Themed";
import Texts from "@/constants/Texts";
import { normalizeHtml } from "@/utils/format";

export default function ActionModal(props: { item: Post }) {
  const [visible, setVisible] = useAtom(showBrowseHistoryActionModalAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const borderColor = useThemeColor({}, "border");
  const close = () => {
    setVisible(false);
  };
  const confirmDelete = (callback: () => void) => {
    Alert.alert("确认删除吗", "删除后不可回复", [
      { text: "取消", onPress: close },
      {
        text: "确认",
        onPress: async () => {
          callback();
          close();
          Toast.show({
            type: "success",
            text1: "删除成功",
          });
        },
      },
    ]);
  };

  const onDelete = () => {
    confirmDelete(() => {
      setHistory(history.filter((x: any) => x.id !== props.item.id));
    });
  };

  return (
    <Modal isVisible={visible} onBackdropPress={close}>
      <View style={styles.actionModal}>
        <View
          style={[styles.actionModalItem, styles.actionHeader, { borderBottomColor: borderColor }]}>
          <Text numberOfLines={1}>{normalizeHtml(props.item.content) || Texts.defaultContent}</Text>
        </View>
        <TouchableOpacity style={styles.actionModalItem} onPress={onDelete}>
          <Text>删除浏览记录</Text>
          <Text>Po.{props.item.id}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actionModal: {
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "flex-start",
    borderRadius: 10,
    overflow: "hidden",
    width: 300,
    paddingVertical: 6,
    paddingHorizontal: 24,
  },
  actionModalItem: {
    width: "100%",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionHeader: {
    borderBottomWidth: 1,
  },
});
