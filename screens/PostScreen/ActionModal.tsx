import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import Modal from "react-native-modal";
import { decode } from "html-entities";
import { useAtom } from "jotai";
import Toast from "react-native-root-toast";
import { useNavigation } from "@react-navigation/native";

import { Text, View } from "../../components/Themed";
import { Reply, deleteReply } from "../../api";
import { cookiesAtom, showActionModalAtom } from "../../atoms/index";
import { Cookie } from "../ProfileScreen";

export default function ActionModal(props: {
  item: Reply;
  postId: number;
  forumId: number;
}) {
  const [visible, setVisible] = useAtom(showActionModalAtom);
  const [cookies] = useAtom<Cookie[]>(cookiesAtom);
  const navigation = useNavigation();
  const close = () => {
    setVisible(false);
  };
  const onReply = () => {
    close();
    navigation.navigate("ReplyModal", {
      postId: props.postId,
      content: `>>Po.${props.item.id}\n`,
      forumId: props.forumId,
    });
  };
  const onCopy = () => {
    Clipboard.setString(decode(props.item.content)?.replace(/<[^>]*>/g, ""));
    close();
    Toast.show("已复制到剪贴板");
  };

  const onDelete = () => {
    Alert.alert("确认删除吗？", "", [
      { text: "取消" },
      {
        text: "确认",
        onPress: async () => {
          const replyCookie = cookies.find(
            (cookie) => cookie.code.indexOf(props.item.cookie) !== -1
          );
          try {
            const {
              data: { type, info },
            } = await deleteReply(
              props.item.id,
              `${props.item.cookie}#${replyCookie?.hash}`
            );
            if (type === "OK") {
              Toast.show("删除成功，请刷新页面");
            } else {
              Toast.show(info.toString() || "出错了");
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
      animationInTiming={300}
      animationIn="slideInUp"
    >
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
        {cookies.find(
          (cookie) => cookie.code.indexOf(props.item.cookie) !== -1
        ) && (
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
