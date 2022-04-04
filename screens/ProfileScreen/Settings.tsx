import { StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { View, Text, useThemeColor } from "../../components/Themed";

export default function Settings() {
  const navigation = useNavigation();
  const tintColor = useThemeColor({}, "tint");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>应用设置</Text>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.navigate("LayoutSettings");
        }}
      >
        <Text style={{ ...styles.itemLabel, color: tintColor }}>显示设置</Text>
        <FontAwesome
          name="chevron-right"
          color={tintColor}
          size={12}
        ></FontAwesome>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    height: 40,
  },
  itemLabel: {
    minWidth: "20%",
  },
});
