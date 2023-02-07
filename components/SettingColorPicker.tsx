import Color from "color";
import { useAtom } from "jotai";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";

import Icon from "./Icon";

import { SizeContext } from "@/Provider";
import Modal from "@/components/Modal";
import { Button, Text, TextInput, View } from "@/components/Themed";
import Layout from "@/constants/Layout";

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

export default function SettingColorPicker(props: {
  title: string;
  atom: any;
  onValidate?: (color: string) => boolean;
  inverted?: boolean;
  palette?: string[];
}) {
  const [color] = useAtom<string>(props.atom);
  const BASE_SIZE = useContext(SizeContext);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.item, { height: BASE_SIZE * 4 }]}
        onPress={() => {
          setVisible(true);
        }}>
        <Text style={{ ...styles.itemLabel }}>{props.title}</Text>
        <Icon name="tint" color={props.inverted ? Color(color).negate().hex() : color} />
      </TouchableOpacity>
      <ColorPickerModal
        atom={props.atom}
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
        onValidate={props.onValidate}
        palette={props.palette}
      />
    </>
  );
}

function ColorPickerModal(props: {
  atom: any;
  visible: boolean;
  onDismiss: () => void;
  onValidate?: (color: string) => boolean;
  palette?: string[];
}) {
  const [color, setColor] = useAtom(props.atom);
  const [hex, setHex] = useState(color);
  const [selectedColor, setSelectedColor] = useState(color);
  const close = () => {
    props.onDismiss();
  };
  useEffect(() => {
    setSelectedColor(color);
  }, [color]);
  useEffect(() => {
    if (selectedColor !== hex) {
      setHex(selectedColor);
    }
  }, [hex, selectedColor]);
  return (
    <Modal isVisible={props.visible} onBackdropPress={close} avoidKeyboard>
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
          palette={props.palette || PALETTE}
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
              if (props.onValidate?.(selectedColor as string) === false) {
                return;
              }
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
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: Layout.settingItemPaddingRight,
    alignItems: "center",
  },
  itemLabel: {
    minWidth: "20%",
  },
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
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 20,
  },
  footerButton: {
    marginLeft: 20,
  },
  input: {
    minWidth: 60,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    fontWeight: "bold",
  },
});
