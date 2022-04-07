import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import ColorPicker from "react-native-wheel-color-picker";

import { showColorPickerModalAtom } from "@/atoms";
import { Button, TextInput, View } from "@/components/Themed";

const PALETTE = [
  "#FC4C5D",
  "#FC88B3",
  "#46CCFF",
  "#ef9a9a",
  "#ce93d8",
  "#b39ddb",
  "#9fa8da",
  "#80cbc4",
  "#ffcc80",
  "#ffab91",
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
    <Modal
      isVisible={visible}
      onBackdropPress={close}
      backdropOpacity={0.3}
      backdropTransitionOutTiming={0}>
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
