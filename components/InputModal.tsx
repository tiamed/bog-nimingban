import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import Modal from "@/components/Modal";
import { Button, Text, View, TextInput } from "@/components/Themed";

export default function InputModal(props: {
  visible: boolean;
  title: string;
  placeholder: string;
  initialValue?: string;
  onConfirm: (text: string) => void;
  onDismiss: () => void;
}) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (props.initialValue) {
      setText(props.initialValue);
    }
  }, [props.initialValue]);

  return (
    <Modal isVisible={props.visible} onBackdropPress={props.onDismiss} avoidKeyboard>
      <View style={styles.modal}>
        <Text style={styles.title}>{props.title}</Text>
        <TextInput
          placeholder={props.placeholder}
          value={text}
          onChangeText={(val) => setText(val)}
          style={styles.input}
        />
        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <Button title="取消" onPress={props.onDismiss} />
          </View>
          <View style={styles.footerButton}>
            <Button
              title="确定"
              onPress={() => {
                props.onConfirm(text);
                props.onDismiss();
              }}
            />
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
