import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import Toast from "react-native-toast-message";

import { loadingsAtom, loadingsUrlAtom } from "@/atoms";
import InputModal from "@/components/InputModal";
import SettingItem from "@/components/SettingItem";
import Urls from "@/constants/Urls";

export default function LoadingsItem() {
  const [visible, setVisible] = useState(false);
  const [loadingsUrl, setLoadingsUrl] = useAtom(loadingsUrlAtom);
  const setLoadings = useSetAtom(loadingsAtom);
  return (
    <>
      <SettingItem title="加载语录设置" desc="自定义加载语录" onPress={() => setVisible(true)} />
      <InputModal
        visible={visible}
        title="更新加载语录"
        initialValue={loadingsUrl}
        placeholder="详见关于>加载语录"
        onConfirm={async (value) => {
          const res = await fetch(value || Urls.slang);
          const loadings = await res.json();
          if (loadings.length > 0 && loadings.every((x: string) => typeof x === "string")) {
            setLoadings(loadings);
            setLoadingsUrl(value);
            Toast.show({ type: "success", text1: "成功更新加载语录" });
          } else {
            Toast.show({ type: "error", text1: "格式错误" });
          }
        }}
        onDismiss={() => setVisible(false)}
      />
    </>
  );
}
