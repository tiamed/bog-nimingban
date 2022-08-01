import { StyleSheet, TouchableOpacity } from "react-native";

import Icon from "@/components/Icon";
import { useThemeColor, View } from "@/components/Themed";
import Layout from "@/constants/Layout";

interface FooterItem {
  icon: React.ComponentProps<typeof Icon>["name"];
  family?: React.ComponentProps<typeof Icon>["family"];
  onPress: () => void;
  inverted?: boolean;
}

export default function Footer(props: { items: FooterItem[] }) {
  const tintColor = useThemeColor({}, "tint");
  return (
    <>
      <View
        style={{
          flex: 6 - props.items.length,
          backgroundColor: tintColor,
        }}
      />
      {props.items?.map(({ icon, family, onPress, inverted }) => (
        <TouchableOpacity
          key={icon}
          onPress={onPress}
          style={[styles.icon, inverted && { backgroundColor: tintColor, borderRadius: 60 }]}
          hitSlop={{ left: 0, right: 0, top: 10, bottom: 10 }}>
          <Icon color={inverted ? "white" : tintColor} name={icon} family={family || "Octicons"} />
        </TouchableOpacity>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  icon: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    marginHorizontal: Layout.replyEditorHorizontalPadding,
  },
});
