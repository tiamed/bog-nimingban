import { StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { View, Text, useThemeColor } from "../../components/Themed";
import { RootStackParamList } from "../../types";

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>应用设置</Text>
      <JumpToSettings title="显示设置" navigateTo="LayoutSettings" />
      <JumpToSettings title="屏蔽串设置" navigateTo="BlackList" />
    </View>
  );
}

function JumpToSettings(props: {
  title: string;
  navigateTo: keyof RootStackParamList;
}) {
  const navigation = useNavigation();
  const tintColor = useThemeColor({}, "tint");
  return (
    <View>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.navigate(props.navigateTo);
        }}
      >
        <Text style={{ ...styles.itemLabel, color: tintColor }}>
          {props.title}
        </Text>
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
