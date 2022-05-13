import { addSeconds, formatRelative } from "date-fns";
import { zhCN } from "date-fns/locale";
import * as Clipboard from "expo-clipboard";
import { useAtom } from "jotai";
import { useState } from "react";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import { showCreateModalAtom } from "./common";

import { createCookie } from "@/api";
import Modal from "@/components/Modal";
import { Button, Text, View, TextInput } from "@/components/Themed";
import Errors from "@/constants/Errors";

export default function CreateCookieModal() {
  const [visible, setVisible] = useAtom(showCreateModalAtom);
  const [exchangeCode, setExchangeCode] = useState("");

  const close = () => {
    setExchangeCode("");
    setVisible(false);
  };
  const confirm = async () => {
    const {
      data: { code, info },
    } = await createCookie(exchangeCode);
    if (code === 2) {
      await Clipboard.setString(info);
      Toast.show({ type: "success", text1: "饼干已复制到剪贴板", text2: info });
    } else {
      switch (code) {
        case 2001:
          Toast.show({
            type: "error",
            text1: `${formatRelative(addSeconds(new Date(), Number(info)), Date.now(), {
              locale: zhCN,
            })} 才可以获取饼干`,
          });
          break;
        default:
          Toast.show({
            type: "error",
            text1: Errors[code] || info,
          });
          break;
      }
    }
  };

  return (
    <Modal isVisible={visible} onBackdropPress={close} avoidKeyboard>
      <View style={styles.modal}>
        <Text style={styles.title}>获取饼干</Text>
        <TextInput
          placeholder="兑换码(BTM发电订单号)，可不填"
          value={exchangeCode}
          onChangeText={(val) => setExchangeCode(val)}
          style={styles.input}
        />
        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <Button title="取消" onPress={close} />
          </View>
          <View style={styles.footerButton}>
            <Button title="确定" onPress={confirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  modal: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    margin: 2,
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
    overflow: "hidden",
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    paddingVertical: 10,
  },
  footerButton: {
    marginLeft: 20,
  },
});
