import { StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { View, Text, useThemeColor } from "../../components/Themed";
import { useAtom } from "jotai";
import { colorSchemeAtom, sizeAtom } from "../../atoms";

export default function Layout() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>显示设置</Text>
      <FontPicker></FontPicker>
      <ColorSchemePicker></ColorSchemePicker>
    </View>
  );
}

function FontPicker() {
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const [size, setSize] = useAtom(sizeAtom);
  const options = [
    { label: "小", value: "small" },
    { label: "普通", value: "normal" },
    { label: "中", value: "medium" },
    { label: "大", value: "large" },
    { label: "特大", value: "extraLarge" },
  ];
  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>字体大小</Text>
      <Picker
        style={{
          color: tintColor,
          backgroundColor: backgroundColor,
          flex: 1,
        }}
        selectedValue={size}
        onValueChange={(val: string) => setSize(val)}
      >
        {options?.map((option: any) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
          ></Picker.Item>
        ))}
      </Picker>
    </View>
  );
}

function ColorSchemePicker() {
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const [colorScheme, setColorScheme] = useAtom(colorSchemeAtom);
  const options = [
    { label: "跟随系统", value: null },
    { label: "亮", value: "light" },
    { label: "暗", value: "dark" },
  ];
  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>主题</Text>
      <Picker
        style={{
          color: tintColor,
          backgroundColor: backgroundColor,
          flex: 1,
        }}
        selectedValue={colorScheme}
        onValueChange={(val: any) => setColorScheme(val)}
      >
        {options?.map((option: any) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
          ></Picker.Item>
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  itemLabel: {
    minWidth: "20%",
  },
});
