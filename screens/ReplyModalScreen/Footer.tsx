import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useThemeColor, View } from "../../components/Themed";
import Icon from "../../components/Icon";

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
      ></View>
      {props.items?.map(({ icon, onPress }) => (
        <TouchableOpacity key={icon} onPress={onPress} style={styles.icon}>
          <Icon color={tintColor} name={icon}></Icon>
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
