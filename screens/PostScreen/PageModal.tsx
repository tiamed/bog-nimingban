import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  Text,
  View,
  useThemeColor,
  Button,
  TextInput,
} from "../../components/Themed";
import { showPageModalAtom } from "../../atoms/index";
import { useAtom } from "jotai";

export default function PageModal(props: {
  index: number;
  total: number;
  loadData: (page: number, jump: boolean) => void;
}) {
  const { index, total } = props;
  const [visible, setVisible] = useAtom(showPageModalAtom);
  const [input, setInput] = useState("1");

  useEffect(() => {
    setInput(`${index}`);
  }, [index]);

  const close = () => {
    setVisible(false);
  };
  const confirm = () => {
    if (input) {
      const page = parseInt(input);
      if (Number.isInteger(page) && page > 0 && page <= total) {
        props.loadData(page, true);
      }
    }
    close();
  };
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={close}
      backdropOpacity={0.3}
      backdropTransitionOutTiming={0}
    >
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>跳页</Text>
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={() => {
              setInput("1");
            }}
          >
            <MaterialCommunityIcons
              color={useThemeColor({}, "tint")}
              size={24}
              name="step-backward"
            ></MaterialCommunityIcons>
          </TouchableOpacity>
          <View style={styles.modalInputWrapper}>
            <TextInput
              style={styles.modalInput}
              onChangeText={(val) => setInput(val)}
              value={input}
            />
            <Text>/{Math.ceil(total / 20)}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setInput(`${Math.ceil(total / 20)}`);
            }}
          >
            <MaterialCommunityIcons
              color={useThemeColor({}, "tint")}
              size={24}
              name="step-forward"
            ></MaterialCommunityIcons>
          </TouchableOpacity>
        </View>
        <View style={styles.modalFooter}>
          <View style={styles.modalFooterButton}>
            <Button title="取消" onPress={close}></Button>
          </View>
          <View style={styles.modalFooterButton}>
            <Button title="确定" onPress={confirm}></Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 20,
    padding: 10,
  },
  modalContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modalFooter: {
    padding: 20,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  modalFooterButton: {
    marginLeft: 20,
  },
  modalInput: {
    width: 50,
    textAlign: "center",
  },
  modalInputWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
