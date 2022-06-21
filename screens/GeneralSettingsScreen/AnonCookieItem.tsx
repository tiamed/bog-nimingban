import { useAtom } from "jotai";
import { useState } from "react";
import Toast from "react-native-toast-message";

import { anonCookieTextAtom } from "@/atoms";
import InputModal from "@/components/InputModal";
import SettingItem from "@/components/SettingItem";

export default function AnonCookieItem() {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useAtom(anonCookieTextAtom);
  return (
    <>
      <SettingItem
        title="匿名饼干名称修改"
        desc="自定义匿名饼干"
        onPress={() => setVisible(true)}
      />
      <InputModal
        visible={visible}
        title="自定义匿名饼干"
        initialValue={text}
        placeholder="填写全员饼干名称"
        onConfirm={async (value) => {
          setText(value);
          Toast.show({ type: "success", text1: "成功修改自定义匿名饼干" });
        }}
        onDismiss={() => setVisible(false)}
      />
    </>
  );
}
