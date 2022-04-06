import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { decode } from "html-entities";
import { useAtom } from "jotai";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";

import { Reply, deleteReply } from "@/api";
import { cookiesAtom, showActionModalAtom } from "@/atoms/index";
import { Text, View } from "@/components/Themed";
import Errors from "@/constants/Errors";
import { Cookie } from "@/screens/ProfileScreen/Cookie";

export default function ActionModal(props: { item: Reply; postId: number; forumId: number }) {
  const [visible, setVisible] = useAtom(showActionModalAtom);
  const [cookies] = useAtom<Cookie[]>(cookiesAtom);
  const navigation = useNavigation();
  const close = () => {
    setVisible(false);
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
    Clipboard.setString(decode(props.item.content)?.replace(/<[^>]*>/g, ""));
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
      isVisible={visible}
      onBackdropPress={close}
      backdropOpacity={0.3}
      backdropTransitionOutTiming={0}>
      <View style={styles.actionModal}>
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
  actionModal: {
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "flex-start",
    borderRadius: 10,
    overflow: "hidden",
    width: 300,
    padding: 6,
  },
  actionModalItem: {
    padding: 10,
    marginLeft: 20,
    width: 260,
  },
});
