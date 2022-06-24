import { StyleSheet } from "react-native";

import AnonCookieItem from "./AnonCookieItem";
import BackupItem from "./BackupItem";
import BlackListForumsItem from "./BlackListForumsItem";
import LoadingsItem from "./LoadingsItem";

import {
  autoExpandAtom,
  checkUpdateIntervalAtom,
  noImageModeAtom,
  shouldMemorizePostFilteredAtom,
  clickableAtom,
  vibrateAtom,
  anonCookieModeAtom,
  nativeImageRendererAtom,
} from "@/atoms";
import JumpToSettings from "@/components/JumpToSettings";
import SettingPicker from "@/components/SettingPicker";
import SettingSwitch from "@/components/SettingSwitch";
import { ScrollView, View } from "@/components/Themed";

export default function GeneralSettingsScreen() {
  return (
    <ScrollView style={{ flex: 1, flexDirection: "column" }}>
      <View style={styles.container}>
        <SettingSwitch title="振动反馈" atom={vibrateAtom} />
        <SettingSwitch title="记住只看po" atom={shouldMemorizePostFilteredAtom} />
        <SettingSwitch title="串外链接启用点击" atom={clickableAtom} />
        <SettingSwitch title="切换预览图渲染模式" atom={nativeImageRendererAtom} />
        <SettingSwitch title="串引用自动展开" atom={autoExpandAtom} />
        <SettingSwitch title="匿名饼干模式" atom={anonCookieModeAtom} />
        <SettingPicker
          title="无图模式"
          options={[
            { label: "关闭", value: "off" },
            { label: "开启", value: "on" },
            { label: "仅wifi加载", value: "cellular" },
          ]}
          atom={noImageModeAtom}
        />
        <SettingPicker
          title="自动检查更新间隔"
          options={[
            { label: "30分钟", value: 30 * 60 * 1000 },
            { label: "1小时", value: 60 * 60 * 1000 },
            { label: "6小时", value: 6 * 60 * 60 * 1000 },
            { label: "12小时", value: 12 * 60 * 60 * 1000 },
            { label: "1天", value: 24 * 60 * 60 * 1000 },
            { label: "3天", value: 3 * 24 * 60 * 60 * 1000 },
            { label: "7天", value: 7 * 24 * 60 * 60 * 1000 },
          ]}
          atom={checkUpdateIntervalAtom}
        />
        <AnonCookieItem />
        <JumpToSettings title="屏蔽串设置" desc="首页长按串进行屏蔽" navigateTo="BlackList" />
        <JumpToSettings
          title="屏蔽饼干设置"
          desc="首页长按串进行屏蔽，将隐藏对应的主题串"
          navigateTo="BlackListUser"
        />
        <JumpToSettings
          title="屏蔽词设置"
          desc="隐藏对应的主题串，支持正则"
          navigateTo="BlackListWord"
        />
        <BlackListForumsItem />
        <JumpToSettings title="版块管理" desc="版块排序和隐藏" navigateTo="ForumSettings" />
        <LoadingsItem />
        <BackupItem />
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
    minHeight: "100%",
  },
});
