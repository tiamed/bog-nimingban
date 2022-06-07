import { Picker as DefaultPicker } from "@react-native-picker/picker";
import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";

import { Octicon } from "./Icon";
import { useThemeColor, Text, Button, View } from "./Themed";

import Modal from "@/components/Modal";
import Layout from "@/constants/Layout";

export default function Picker(props: {
  selectedValue: any;
  options: any[];
  placeholder?: string;
  emptyText?: string;
  onValueChange: ((itemValue: any, itemIndex: number) => void) | undefined;
}) {
  const { selectedValue, options } = props;
  const tintColor = useThemeColor({}, "tint");
  const inactiveColor = useThemeColor({}, "inactive");
  const backgroundColor = useThemeColor({}, "background");
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const pickerRef = useRef<DefaultPicker<any>>(null);
  const close = () => {
    setVisible(false);
  };
  const onValueChange = (value: any, index: number) => {
    if (loaded) {
      props.onValueChange && props.onValueChange(value, index);
    }
  };
  useEffect(() => {
    if (options?.length) {
      const currentOption = options.find((option) => option?.value === selectedValue);
      setSelectedLabel(currentOption?.label || "");
    }
  }, [selectedValue, options]);
  useEffect(() => {
    const index = options.findIndex((option) => option?.value === selectedValue);
    onValueChange(selectedValue, index);
  }, [selectedValue]);
  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100);
    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <>
      <TouchableOpacity
        style={styles.item}
        disabled={!options.length}
        onPress={() => {
          if (Platform.OS === "ios") {
            setVisible(true);
          } else {
            pickerRef.current?.focus();
          }
        }}>
        <Text style={{ color: options.length ? tintColor : inactiveColor }}>
          {options.length ? selectedLabel || props.placeholder : props.emptyText}
        </Text>
        <Octicon name="triangle-down" color={options.length ? tintColor : inactiveColor} />
      </TouchableOpacity>
      {Platform.OS === "ios" ? (
        <Modal isVisible={visible} onBackdropPress={close} style={styles.modalWrapper}>
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
      ) : (
        <DefaultPicker
          ref={pickerRef}
          style={{ display: "none" }}
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
      )}
    </>
  );
}

const styles = StyleSheet.create({
  picker: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    paddingVertical: 10,
    paddingRight: Layout.settingItemPaddingRight,
  },
  button: {
    paddingHorizontal: 5,
  },
  modalWrapper: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modal: {
    flexDirection: "column",
    justifyContent: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
    paddingVertical: 20,
    paddingHorizontal: 10,
    minHeight: 300,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
