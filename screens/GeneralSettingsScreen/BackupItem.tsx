import { useSetAtom } from "jotai";

import BackupModal, { showBackupModalAtom } from "./BackupModal";

import SettingItem from "@/components/SettingItem";

export default function BackupItem() {
  const setShowBackupModal = useSetAtom(showBackupModalAtom);
  return (
    <>
      <SettingItem title="备份设置" desc="导出导入备份" onPress={() => setShowBackupModal(true)} />
      <BackupModal />
    </>
  );
}
