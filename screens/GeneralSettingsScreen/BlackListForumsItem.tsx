import { useAtom } from "jotai";
import { useState } from "react";

import { blackListForumsAtom } from "@/atoms";
import PickerModal from "@/components/PickerModal";
import SettingItem from "@/components/SettingItem";
import { useTimelineForums } from "@/hooks/useForums";

export default function BlackListForumsItem() {
  const [visible, setVisible] = useState(false);
  const forums = useTimelineForums();
  const [blackListForums, setBlackListForums] = useAtom(blackListForumsAtom);
  return (
    <>
      <SettingItem
        title="时间线版块屏蔽设置"
        desc="屏蔽的版块将不再显示在时间线中"
        onPress={() => setVisible(true)}
      />
      <PickerModal
        visible={visible}
        initialValue={blackListForums}
        options={forums
          .filter((forum) => forum.timeline)
          .map((forum) => ({ label: forum.name, value: forum.id }))}
        onDismiss={() => setVisible(false)}
        onValueChange={(value) => setBlackListForums(value)}
      />
    </>
  );
}
