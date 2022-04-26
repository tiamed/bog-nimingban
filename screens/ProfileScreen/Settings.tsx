import { useContext } from "react";
import { StyleSheet, View } from "react-native";

import { SizeContext } from "@/Provider";
import JumpToSettings from "@/components/JumpToSettings";
import { Text } from "@/components/Themed";

export default function Settings() {
  const BASE_SIZE = useContext(SizeContext);
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: BASE_SIZE * 1.25 }]}>应用设置</Text>
      <JumpToSettings title="显示设置" navigateTo="LayoutSettings" />
      <JumpToSettings title="通用设置" navigateTo="GeneralSettings" />
      <JumpToSettings title="关于" navigateTo="About" />
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
    marginBottom: 50,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },
});
