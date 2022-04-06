import { StyleSheet } from "react-native";

import { ScrollView } from "../components/Themed";
import { RootStackScreenProps } from "../types";

import { View, Text } from "../components/Themed";
import SettingPicker from "../components/SettingPicker";
import {
  colorSchemeAtom,
  imageWidthAtom,
  lineHeightAtom,
  maxLineAtom,
  sizeAtom,
  threadDirectionAtom,
  thumbnailResizeAtom,
} from "../atoms";

export default function ProfileScreen({
  navigation,
}: RootStackScreenProps<"LayoutSettings">) {
  return (
    <ScrollView style={{ flex: 1, flexDirection: "column" }}>
      <View style={styles.container}>
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
        <SettingPicker
          title="串内每行图片数"
          atom={imageWidthAtom}
          options={[
            ...[...Array(5)].map((_, i) => ({
              label: `${i + 1}`,
              value: `${100 / (i + 1) - 1}%`,
            })),
          ]}
        ></SettingPicker>
      </View>
    </ScrollView>
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
});
