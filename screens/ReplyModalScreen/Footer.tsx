import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useThemeColor, View } from "../../components/Themed";
import TabBarIcon from "../../components/TabBarIcon";

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
          <TabBarIcon color={tintColor} name={icon}></TabBarIcon>
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
