import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import { useAtom, useSetAtom } from "jotai";
import { useContext, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

import ColorPickerModal from "./ColorPickerModal";

import { SizeContext } from "@/Provider";
import {
  colorSchemeAtom,
  imageWidthAtom,
  lineHeightTimesAtom,
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
  textColorAlphaAtom,
  bottomGapAtom,
  lineHeightAtom,
  showTabBarLabelAtom,
} from "@/atoms";
import Icon from "@/components/Icon";
import JumpToSettings from "@/components/JumpToSettings";
import SettingItem from "@/components/SettingItem";
import SettingPicker from "@/components/SettingPicker";
import SettingSlider from "@/components/SettingSlider";
import SettingSwitch from "@/components/SettingSwitch";
import { ScrollView, View, Text, useThemeColor } from "@/components/Themed";
import Fonts from "@/constants/Fonts";
import Layout from "@/constants/Layout";
import Texts from "@/constants/Texts";
import { RootStackScreenProps } from "@/types";

export default function ProfileScreen({ navigation }: RootStackScreenProps<"LayoutSettings">) {
  const setColorPickerModalVisible = useSetAtom(showColorPickerModalAtom);
  const tintColor = useThemeColor({}, "tint");
  const highlightColor = useThemeColor({}, "highlight");
  const [currentAtom, setCurrentAtom] = useState(tintColorAtom);
  const BASE_SIZE = useContext(SizeContext);
  const [LINE_HEIGHT] = useAtom(lineHeightAtom);
  return (
    <ScrollView style={{ flex: 1, flexDirection: "column" }}>
      <View style={styles.container}>
        <JumpToSettings
          title="底栏按钮调整"
          desc="调整串内底栏按钮顺序"
          navigateTo="FooterLayout"
        />
        <SettingSwitch title="展示首页底栏文字" atom={showTabBarLabelAtom} />
        <SettingSwitch title="首页展示回复" atom={showThreadReplyAtom} />
        <SettingSwitch title="搜索结果按主题展示" atom={groupSearchResultsAtom} />
        <SettingSwitch title="展示回复时逆序" atom={threadReplyReverseAtom} />
        <Text
          style={{
            width: "100%",
            lineHeight: LINE_HEIGHT,
            borderColor: tintColor,
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}>
          {Texts.sample}
        </Text>
        <SettingPicker
          title="字体"
          atom={fontFamilyAtom}
          options={[
            { label: "系统默认", value: null, id: "system" },
            { label: "noto-sans", value: "noto-sans" },
            { label: "noto-serif", value: "noto-serif" },
            { label: "space-mono", value: "space-mono" },
            ...Fonts?.map((font) => ({ label: font, value: font })),
          ]}
        />
        <SettingSlider title="文字亮度" atom={textColorAlphaAtom} min={0.5} max={1} />
        <SettingSlider title="字体大小" atom={sizeAtom} min={12} max={20} step={1} />
        <SettingSlider title="主题串间距" atom={bottomGapAtom} min={1} max={16} />
        <SettingSlider title="行距" atom={lineHeightTimesAtom} min={1.2} max={1.6} step={0.1} />
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
              value: `${Number.parseFloat((100 / (i + 1)).toFixed(4)) - 1}%`,
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
        <SettingItem
          title="恢复默认显示设置"
          onPress={() => {
            Alert.alert("恢复默认显示设置", "将恢复默认显示设置，并重启应用", [
              { text: "取消" },
              {
                text: "确定",
                onPress: () => {
                  AsyncStorage.multiRemove(Layout.settingKeys);
                  Updates.reloadAsync();
                },
              },
            ]);
          }}
        />
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
    paddingRight: Layout.settingItemPaddingRight,
    alignItems: "center",
  },
  itemLabel: {
    minWidth: "20%",
  },
});
