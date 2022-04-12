import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { useState } from "react";
import { FloatingAction } from "react-native-floating-action";

import TagModal from "../../components/TagModal";

import { favoriteFilterAtom } from "@/atoms";
import { useThemeColor } from "@/components/Themed";

export default function FavoriteFloatingAction() {
  const tintColor = useThemeColor({}, "tint");
  const [favoriteFilter, setFavoriteFilter] = useAtom(favoriteFilterAtom);
  const [visible, setVisible] = useState(false);

  const onPress = () => {
    setVisible(true);
  };
  return (
    <>
      <FloatingAction
        overrideWithAction
        color={tintColor}
        actions={[
          {
            icon: <MaterialCommunityIcons name="tag" color="white" size={20} />,
            name: "tag",
            color: tintColor,
          },
        ]}
        onPressItem={onPress}
      />
      <TagModal
        visible={visible}
        initialValue={[favoriteFilter]}
        maxLimit={1}
        onDismiss={() => setVisible(false)}
        onOpen={() => setVisible(true)}
        onValueChange={([id]) => {
          setFavoriteFilter(id || "");
        }}
      />
    </>
  );
}
