import { Ionicons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { FloatingAction } from "react-native-floating-action";

import { searchForumFilterAtom } from "@/atoms";
import PickerModal from "@/components/PickerModal";
import { useThemeColor } from "@/components/Themed";
import useForums from "@/hooks/useForums";

export default function SearchFloatingAction() {
  const tintColor = useThemeColor({}, "tint");
  const [searchForumFilter, setSearchForumFilter] = useAtom(searchForumFilterAtom);
  const [visible, setVisible] = useState(false);
  const [forumOptions, setForumOptions] = useState<any>([]);
  const forums = useForums();

  const onPress = () => {
    setVisible(true);
  };

  useEffect(() => {
    setForumOptions(
      forums?.filter((forum) => forum.id !== 0)?.map(({ id, name }) => ({ label: name, value: id }))
    );
  }, [forums]);

  return (
    <>
      <FloatingAction
        overrideWithAction
        color={tintColor}
        actions={[
          {
            icon: <Ionicons name="filter" color="white" size={20} />,
            name: "filter",
            color: tintColor,
          },
        ]}
        onPressItem={onPress}
      />
      <PickerModal
        visible={visible}
        initialValue={searchForumFilter}
        onDismiss={() => setVisible(false)}
        onValueChange={(value) => {
          setSearchForumFilter(value || []);
        }}
        options={forumOptions}
      />
    </>
  );
}
