import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

import Icon from "@/components/Icon";
import { useThemeColor, View } from "@/components/Themed";

interface FooterItem {
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  onPress: () => void;
}

export default function Footer(props: { items: FooterItem[] }) {
  const tintColor = useThemeColor({}, "tint");
  return (
    <>
      <View
        style={{
          flex: 6 - props.items.length,
        }}
      />
      {props.items?.map(({ icon, onPress }) => (
        <TouchableOpacity
          key={icon}
          onPress={onPress}
          style={styles.icon}
          hitSlop={{ left: 0, right: 0, top: 10, bottom: 10 }}>
          <Icon color={tintColor} name={icon} />
        </TouchableOpacity>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  icon: {
    flex: 1,
    alignItems: "center",
  },
});
