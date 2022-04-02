import { StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { View, Text, useThemeColor } from "../../components/Themed";
import { Atom, useAtom } from "jotai";
import {
  colorSchemeAtom,
  lineHeightAtom,
  maxLineAtom,
  sizeAtom,
  threadDirectionAtom,
  thumbnailResizeAtom,
} from "../../atoms";

interface Option {
  label: string;
  value: any;
}

export default function Layout() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>显示设置</Text>
      <SettingPicker
        title="字体大小"
        atom={sizeAtom}
        options={[
          { label: "小", value: "small" },
          { label: "普通", value: "normal" },
          { label: "中", value: "medium" },
          { label: "大", value: "large" },
          { label: "特大", value: "extraLarge" },
        ]}
      ></SettingPicker>
      <SettingPicker
        title="行距"
        atom={lineHeightAtom}
        options={[
          { label: "小", value: 1.2 },
          { label: "普通", value: 1.3 },
          { label: "中", value: 1.4 },
          { label: "大", value: 1.5 },
          { label: "特大", value: 1.6 },
        ]}
      ></SettingPicker>
      <SettingPicker
        title="行数"
        atom={maxLineAtom}
        options={[
          ...[...Array(10)].map((_, i) => ({
            label: `${i + 1}`,
            value: i + 1,
          })),
          { label: "不限", value: 999 },
        ]}
      ></SettingPicker>
      <SettingPicker
        title="主题"
        atom={colorSchemeAtom}
        options={[
          { label: "跟随系统", value: null },
          { label: "亮", value: "light" },
          { label: "暗", value: "dark" },
        ]}
      ></SettingPicker>
      <SettingPicker
        title="图片位置"
        atom={threadDirectionAtom}
        options={[
          { label: "左", value: "row-reverse" },
          { label: "右", value: "row" },
        ]}
      ></SettingPicker>
      <SettingPicker
        title="图片缩放"
        atom={thumbnailResizeAtom}
        options={[
          { label: "包含", value: "contain" },
          { label: "平铺", value: "cover" },
        ]}
      ></SettingPicker>
    </View>
  );
}

function SettingPicker<T>(props: {
  title: string;
  atom: any;
  options: Option[];
}) {
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const [value, setValue] = useAtom(props.atom);

  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>{props.title}</Text>
      <Picker
        style={{
          color: tintColor,
          backgroundColor: backgroundColor,
          flex: 1,
        }}
        itemStyle={{
          color: tintColor,
        }}
        selectedValue={value as string | undefined}
        onValueChange={(val: string) => setValue(val)}
      >
        {props.options?.map((option: any) => (
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
