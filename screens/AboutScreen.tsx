import { Linking, StyleSheet, TouchableHighlight } from "react-native";
import Toast from "react-native-toast-message";

import { View, Text, useThemeColor } from "@/components/Themed";
import { checkUpdate } from "@/tasks/checkAppUpdate";
import { RootStackScreenProps } from "@/types";

export default function AboutScreen({ route, navigation }: RootStackScreenProps<"About">) {
  const tintColor = useThemeColor({}, "tint");
  const underlayColor = useThemeColor({}, "inactive");
  return (
    <View style={styles.container}>
      <TouchableHighlight
        underlayColor={underlayColor}
        style={styles.item}
        onPress={() => {
          navigation.navigate("Post", {
            id: 141412,
            title: "Po.141412",
          });
        }}>
        <Text style={{ color: tintColor }}>反馈串</Text>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor={underlayColor}
        style={styles.item}
        onPress={() => {
          Linking.openURL("https://github.com/tiamed/bog-nimingban");
        }}>
        <Text style={{ color: tintColor }}>Github</Text>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor={underlayColor}
        style={styles.item}
        onPress={async () => {
          const result = await checkUpdate();
          if (!result) {
            Toast.show({
              type: "info",
              text1: "暂无更新",
            });
          }
        }}>
        <Text style={{ color: tintColor }}>检查更新</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});
