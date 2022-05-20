import { useSetAtom } from "jotai";
import { StyleSheet } from "react-native";

import BackupModal, { showBackupModalAtom } from "./BackupModal";
import BlackListForumsItem from "./BlackListForumsItem";
import LoadingsItem from "./LoadingsItem";

import { noImageModeAtom, shouldMemorizePostFilteredAtom, vibrateAtom } from "@/atoms";
import JumpToSettings from "@/components/JumpToSettings";
import SettingItem from "@/components/SettingItem";
import SettingPicker from "@/components/SettingPicker";
import SettingSwitch from "@/components/SettingSwitch";
import { View } from "@/components/Themed";

export default function GeneralSettingsScreen() {
  const setShowBackupModal = useSetAtom(showBackupModalAtom);
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
      <JumpToSettings title="屏蔽串设置" desc="首页长按串进行屏蔽" navigateTo="BlackList" />
      <JumpToSettings
        title="屏蔽饼干设置"
        desc="首页长按串进行屏蔽，将隐藏对应的主题串"
        navigateTo="BlackListUser"
      />
      <BlackListForumsItem />
      <JumpToSettings title="版块管理" desc="版块排序和隐藏" navigateTo="ForumSettings" />
      <LoadingsItem />
      <SettingItem title="备份设置" desc="导出导入备份" onPress={() => setShowBackupModal(true)} />
      <BackupModal />
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
