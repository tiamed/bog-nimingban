import { useSetAtom } from "jotai";
import { StyleSheet } from "react-native";

import BackupModal, { showBackupModalAtom } from "./BackupModal";

import { vibrateAtom } from "@/atoms";
import JumpToSettings from "@/components/JumpToSettings";
import SettingItem from "@/components/SettingItem";
import SettingSwitch from "@/components/SettingSwitch";
import { View } from "@/components/Themed";

export default function GeneralSettingsScreen() {
  const setShowBackupModal = useSetAtom(showBackupModalAtom);
  return (
    <View style={styles.container}>
      <SettingSwitch title="振动反馈" atom={vibrateAtom} />
      <JumpToSettings
        title="屏蔽设置"
        desc="设置屏蔽串，可在首页长按串进行屏蔽"
        navigateTo="BlackList"
      />
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
