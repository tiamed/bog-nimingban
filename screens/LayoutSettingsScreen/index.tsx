import { useSetAtom } from "jotai";
import { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import ColorPickerModal from "./ColorPickerModal";

import {
  colorSchemeAtom,
  imageWidthAtom,
  lineHeightAtom,
  maxLineAtom,
  showColorPickerModalAtom,
  sizeAtom,
  threadDirectionAtom,
  thumbnailResizeAtom,
  tintColorAtom,
  highlightColorAtom,
  accurateTimeFormatAtom,
  showThreadReplyAtom,
  groupSearchResultsAtom,
  fontFamilyAtom,
  threadReplyReverseAtom,
} from "@/atoms";
import Icon from "@/components/Icon";
import JumpToSettings from "@/components/JumpToSettings";
import SettingPicker from "@/components/SettingPicker";
import SettingSwitch from "@/components/SettingSwitch";
import { SizeContext } from "@/components/ThemeContextProvider";
import { ScrollView, View, Text, useThemeColor } from "@/components/Themed";
import { RootStackScreenProps } from "@/types";

export default function ProfileScreen({ navigation }: RootStackScreenProps<"LayoutSettings">) {
  const setColorPickerModalVisible = useSetAtom(showColorPickerModalAtom);
  const tintColor = useThemeColor({}, "tint");
  const highlightColor = useThemeColor({}, "highlight");
  const [currentAtom, setCurrentAtom] = useState(tintColorAtom);
  const BASE_SIZE = useContext(SizeContext);
  return (
    <ScrollView style={{ flex: 1, flexDirection: "column" }}>
      <View style={styles.container}>
        <JumpToSettings
          title="底栏按钮调整"
          desc="调整串内底栏按钮顺序"
          navigateTo="FooterLayout"
        />
        <SettingSwitch title="首页展示回复" atom={showThreadReplyAtom} />
        <SettingSwitch title="搜索结果按主题展示" atom={groupSearchResultsAtom} />
        <SettingSwitch title="展示回复时逆序" atom={threadReplyReverseAtom} />
        <SettingPicker
          title="字体"
          atom={fontFamilyAtom}
          options={[
            { label: "系统默认", value: null, id: "system" },
            { label: "noto-sans", value: "noto-sans" },
            { label: "noto-serif", value: "noto-serif" },
            { label: "space-mono", value: "space-mono" },
          ]}
        />
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
        />
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
        />
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
        />
        <SettingPicker
          title="主题"
          atom={colorSchemeAtom}
          options={[
            { label: "跟随系统", value: null },
            { label: "亮", value: "light" },
            { label: "暗", value: "dark" },
          ]}
        />
        <SettingPicker
          title="图片位置"
          atom={threadDirectionAtom}
          options={[
            { label: "左", value: "row-reverse" },
            { label: "右", value: "row" },
            { label: "上", value: "column-reverse" },
            { label: "下", value: "column" },
          ]}
        />
        <SettingPicker
          title="图片缩放"
          atom={thumbnailResizeAtom}
          options={[
            { label: "包含", value: "contain" },
            { label: "平铺", value: "cover" },
          ]}
        />
        <SettingPicker
          title="串内每行图片数"
          atom={imageWidthAtom}
          options={[
            ...[...Array(8)].map((_, i) => ({
              label: `${i + 1}`,
              value: `${100 / (i + 1) - 1}%`,
            })),
          ]}
        />
        <SettingPicker
          title="时间格式"
          atom={accurateTimeFormatAtom}
          options={[
            { label: "普通", value: false },
            { label: "精确", value: true },
          ]}
        />

        <TouchableOpacity
          style={[styles.item, { height: BASE_SIZE * 4 }]}
          onPress={() => {
            setCurrentAtom(tintColorAtom);
            setColorPickerModalVisible(true);
          }}>
          <Text style={{ ...styles.itemLabel }}>主题色</Text>
          <Icon name="tint" color={tintColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.item, { height: BASE_SIZE * 4 }]}
          onPress={() => {
            setCurrentAtom(highlightColorAtom);
            setColorPickerModalVisible(true);
          }}>
          <Text style={{ ...styles.itemLabel }}>强调色</Text>
          <Icon name="tint" color={highlightColor} />
        </TouchableOpacity>
        <ColorPickerModal atom={currentAtom} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 50,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: 20,
    alignItems: "center",
  },
  itemLabel: {
    minWidth: "20%",
  },
});
