import { useAtom } from "jotai";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import Toast from "react-native-toast-message";

import { Post } from "@/api";
import {
  blackListPostsAtom,
  blackListCookiesAtom,
  showHomeActionModalAtom,
  tabRefreshingAtom,
} from "@/atoms/index";
import Modal from "@/components/Modal";
import { Text, useThemeColor, View } from "@/components/Themed";
import Texts from "@/constants/Texts";
import { normalizeHtml } from "@/utils/format";

export default function ActionModal(props: { item: Post }) {
  const [visible, setVisible] = useAtom(showHomeActionModalAtom);
  const [blackListPosts, setBlackListPosts] = useAtom(blackListPostsAtom);
  const [blackListCookies, setBlackListCookies] = useAtom(blackListCookiesAtom);
  const [, setTabRefreshing] = useAtom(tabRefreshingAtom);
  const borderColor = useThemeColor({}, "border");
  const close = () => {
    setVisible(false);
  };
  const confirmBlock = (callback: () => void) => {
    Alert.alert("确认屏蔽吗", "", [
      { text: "取消", onPress: close },
      {
        text: "确认",
        onPress: async () => {
          callback();
          close();
          Toast.show({
            type: "success",
            text1: "屏蔽成功，可在设置中取消屏蔽",
          });
        },
      },
    ]);
  };

  const onBlockPost = () => {
    confirmBlock(() => {
      setBlackListPosts([...blackListPosts, props.item.id]);
      setTabRefreshing(true);
    });
  };

  const onBlockCookie = () => {
    confirmBlock(() => {
      setBlackListCookies([...blackListCookies, props.item.cookie]);
      setTabRefreshing(true);
    });
  };

  return (
    <Modal isVisible={visible} onBackdropPress={close}>
      <View style={styles.actionModal}>
        <View
          style={[styles.actionModalItem, styles.actionHeader, { borderBottomColor: borderColor }]}>
          <Text numberOfLines={1}>{normalizeHtml(props.item.content) || Texts.defaultContent}</Text>
        </View>
        <TouchableOpacity style={styles.actionModalItem} onPress={onBlockPost}>
          <Text>屏蔽串</Text>
          <Text>Po.{props.item.id}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionModalItem} onPress={onBlockCookie}>
          <Text>屏蔽饼干</Text>
          <Text>{props.item.cookie}</Text>
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
