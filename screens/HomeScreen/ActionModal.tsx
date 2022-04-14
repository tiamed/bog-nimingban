import { useAtom } from "jotai";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import Toast from "react-native-toast-message";

import { Post } from "@/api";
import { blackListPostsAtom, showHomeActionModalAtom, tabRefreshingAtom } from "@/atoms/index";
import Modal from "@/components/Modal";
import { Text, View } from "@/components/Themed";

export default function ActionModal(props: { item: Post }) {
  const [visible, setVisible] = useAtom(showHomeActionModalAtom);
  const [blackListPosts, setBlackListPosts] = useAtom(blackListPostsAtom);
  const [, setTabRefreshing] = useAtom(tabRefreshingAtom);
  const close = () => {
    setVisible(false);
  };
  const onBlock = () => {
    Alert.alert("确认屏蔽吗", "", [
      { text: "取消", onPress: close },
      {
        text: "确认",
        onPress: async () => {
          setBlackListPosts([...blackListPosts, props.item.id]);
          setTabRefreshing(true);
          close();
          Toast.show({
            type: "success",
            text1: "屏蔽成功，可在设置中取消屏蔽",
          });
        },
      },
    ]);
  };

  return (
    <Modal isVisible={visible} onBackdropPress={close}>
      <View style={styles.actionModal}>
        <TouchableOpacity onPress={onBlock}>
          <View style={styles.actionModalItem}>
            <Text>屏蔽串</Text>
          </View>
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
    padding: 6,
  },
  actionModalItem: {
    padding: 10,
    marginLeft: 20,
    width: 260,
  },
});
