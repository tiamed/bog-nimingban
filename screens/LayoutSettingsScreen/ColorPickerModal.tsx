import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";

import { showColorPickerModalAtom } from "@/atoms";
import Modal from "@/components/Modal";
import { Button, TextInput, View } from "@/components/Themed";

const PALETTE = [
  "#FC4C5D",
  "#ff4d6d",
  "#ff7096",
  "#FC88B3",
  "#ef9a9a",
  "#ffab91",
  "#ffcc80",
  "#80cbc4",
  "#80deea",
  "#9fa8da",
  "#b39ddb",
  "#ce93d8",
];

export default function ColorPickerModal(props: { atom: any }) {
  const [visible, setVisible] = useAtom(showColorPickerModalAtom);
  const [color, setColor] = useAtom(props.atom);
  const [hex, setHex] = useState(color);
  const [selectedColor, setSelectedColor] = useState(color);
  const close = () => {
    setVisible(false);
  };
  useEffect(() => {
    setSelectedColor(color);
  }, [color]);
  useEffect(() => {
    if (selectedColor !== hex) {
      setHex(selectedColor);
    }
  }, [selectedColor]);
  return (
    <Modal isVisible={visible} onBackdropPress={close} avoidKeyboard>
      <View style={styles.modal}>
        <ColorPicker
          color={selectedColor as string}
          onColorChangeComplete={(color) => {
            setSelectedColor(color);
          }}
          thumbSize={40}
          sliderSize={40}
          noSnap
          row
          swatches
          palette={PALETTE}
        />
        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            value={hex as string}
            onChangeText={(val) => {
              setHex(val);
              if (/^#([0-9a-f]{6})$/i.test(val)) {
                setSelectedColor(val);
              }
            }}
          />
          <Button title="取消" style={styles.footerButton} onPress={close} />
          <Button
            title="确定"
            style={styles.footerButton}
            onPress={() => {
              setColor(selectedColor);
              close();
            }}
          />
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
    padding: 20,
    minHeight: 500,
  },
  footer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    paddingVertical: 10,
    marginTop: 20,
  },
  footerButton: {
    marginLeft: 20,
  },
  input: {
    minWidth: 60,
  },
});
