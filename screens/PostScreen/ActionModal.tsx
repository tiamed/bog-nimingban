import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { useAtom } from "jotai";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import Toast from "react-native-toast-message";

import { normalizeHtml } from "../../utils/format";

import { Reply, deleteReply } from "@/api";
import { cookiesAtom } from "@/atoms/index";
import Modal from "@/components/Modal";
import { Text, View } from "@/components/Themed";
import Errors from "@/constants/Errors";
import { Cookie } from "@/screens/ProfileScreen/Cookie";

export default function ActionModal(props: {
  item: Reply;
  postId: number;
  forumId: number;
  visible: boolean;
  onClose: () => void;
}) {
  const [cookies] = useAtom<Cookie[]>(cookiesAtom);
  const navigation = useNavigation();
  const close = () => {
    props.onClose();
  };
  const onReply = () => {
    close();
    setTimeout(() => {
      navigation.navigate("ReplyModal", {
        postId: props.postId,
        content: `>>Po.${props.item.id}\n`,
        forumId: props.forumId,
      });
    }, 300);
  };
  const onCopy = () => {
    Clipboard.setString(normalizeHtml(props.item.content));
    close();
    Toast.show({ type: "success", text1: "已复制到剪贴板" });
  };

  const onDelete = () => {
    Alert.alert("确认删除吗？", "", [
      { text: "取消" },
      {
        text: "确认",
        onPress: async () => {
          const replyCookie = cookies.find((cookie) => cookie?.id === props.item.cookie);
          const replyCode = replyCookie?.code?.split("#").slice(0, 2).join("#");
          try {
            const {
              data: { type, code, info },
            } = await deleteReply(props.item.id, replyCode as string);
            if (type === "OK") {
              Toast.show({ type: "success", text1: "删除成功，请刷新页面" });
            } else {
              Toast.show({
                type: "error",
                text1: Errors[code] || info.toString() || "出错了",
              });
            }
          } finally {
            close();
          }
        },
      },
    ]);
  };

  return (
    <Modal
      isVisible={props.visible}
      onBackdropPress={close}
      animationInTiming={1}
      animationOutTiming={1}
      style={styles.modalWrapper}>
      <View style={styles.modal}>
        <TouchableOpacity onPress={onReply}>
          <View style={styles.actionModalItem}>
            <Text>回复</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCopy}>
          <View style={styles.actionModalItem}>
            <Text>复制</Text>
          </View>
        </TouchableOpacity>
        {cookies?.find((cookie) => cookie.id === props.item.cookie) && (
          <TouchableOpacity onPress={onDelete}>
            <View style={styles.actionModalItem}>
              <Text>删除</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "flex-start",
    width: 300,
    padding: 6,
    flex: 1,
  },
  modal: {
    borderRadius: 10,
    overflow: "hidden",
  },
  actionModalItem: {
    padding: 10,
    marginLeft: 20,
    width: 260,
  },
});
