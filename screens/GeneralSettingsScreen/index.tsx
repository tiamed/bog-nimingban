import { StyleSheet } from "react-native";

import { checkUpdateIntervalAtom } from "../../atoms/setting";
import BackupItem from "./BackupItem";
import BlackListForumsItem from "./BlackListForumsItem";
import LoadingsItem from "./LoadingsItem";

import { noImageModeAtom, shouldMemorizePostFilteredAtom, vibrateAtom } from "@/atoms";
import JumpToSettings from "@/components/JumpToSettings";
import SettingPicker from "@/components/SettingPicker";
import SettingSwitch from "@/components/SettingSwitch";
import { View } from "@/components/Themed";

export default function GeneralSettingsScreen() {
  return (
    <View style={styles.container}>
      <SettingSwitch title="振动反馈" atom={vibrateAtom} />
      <SettingSwitch title="记住只看po" atom={shouldMemorizePostFilteredAtom} />
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
      <JumpToSettings title="屏蔽串设置" desc="首页长按串进行屏蔽" navigateTo="BlackList" />
      <JumpToSettings
        title="屏蔽饼干设置"
        desc="首页长按串进行屏蔽，将隐藏对应的主题串"
        navigateTo="BlackListUser"
      />
      <BlackListForumsItem />
      <JumpToSettings title="版块管理" desc="版块排序和隐藏" navigateTo="ForumSettings" />
      <LoadingsItem />
      <BackupItem />
    </View>
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
