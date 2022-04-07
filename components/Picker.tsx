import { Picker as DefaultPicker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

import { useThemeColor, Text, Button, View } from "./Themed";

export default function Picker(props: {
  selectedValue: any;
  options: any[];
  onValueChange: ((itemValue: any, itemIndex: number) => void) | undefined;
}) {
  const { selectedValue, options, onValueChange } = props;
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const [visible, setVisible] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(options[0]?.label || "");
  const close = () => {
    setVisible(false);
  };
  useEffect(() => {
    if (options?.length) {
      const currentOption = options.find((option) => option?.value === selectedValue);
      setSelectedLabel(currentOption?.label || "");
    }
  }, [selectedValue, options]);
  if (Platform.OS === "ios") {
    return (
      <>
        <TouchableOpacity
          style={[styles.item, { borderColor: tintColor }]}
          onPress={() => setVisible(true)}>
          <Text style={{ color: tintColor }}>{selectedLabel}</Text>
        </TouchableOpacity>
        <Modal
          isVisible={visible}
          onBackdropPress={close}
          backdropOpacity={0.3}
          backdropTransitionOutTiming={0}
          style={styles.modalWrapper}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Button title="确认" onPress={close} style={styles.button} />
            </View>
            <DefaultPicker
              style={{
                ...styles.picker,
                backgroundColor,
                color: tintColor,
                width: "100%",
                height: "100%",
              }}
              itemStyle={{
                color: tintColor,
              }}
              selectedValue={selectedValue}
              onValueChange={onValueChange}>
              {options?.map((option: any) => (
                <DefaultPicker.Item
                  key={option.id || option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </DefaultPicker>
          </View>
        </Modal>
      </>
    );
  }
  return (
    <DefaultPicker
      style={{
        ...styles.picker,
        color: tintColor,
        backgroundColor,
      }}
      itemStyle={{
        color: tintColor,
      }}
      selectedValue={selectedValue}
      onValueChange={onValueChange}>
      {options?.map((option: any) => (
        <DefaultPicker.Item
          key={option.id || option.value}
          label={option.label}
          value={option.value}
        />
      ))}
    </DefaultPicker>
  );
}

const styles = StyleSheet.create({
  picker: {
    flex: 1,
  },
  item: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  button: {
    padding: 5,
  },
  modalWrapper: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modal: {
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 10,
    overflow: "hidden",
    padding: 20,
    minHeight: 300,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
