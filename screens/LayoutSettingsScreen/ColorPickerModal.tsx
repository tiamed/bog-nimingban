import { useAtom } from "jotai";
import { useState } from "react";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import ColorPicker from "react-native-wheel-color-picker";

import { showColorPickerModalAtom } from "@/atoms";
import { Button, View } from "@/components/Themed";

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
  const close = () => {
    setVisible(false);
  };
  const [selectedColor, setSelectedColor] = useState(color);
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
          row={false}
          swatches
          palette={PALETTE}
        />
        <View style={styles.footer}>
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
});
