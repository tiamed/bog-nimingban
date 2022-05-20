import { Linking, StyleSheet, TouchableHighlight } from "react-native";

import { View, Text, useThemeColor } from "@/components/Themed";
import { manualUpdate } from "@/tasks/checkAppUpdate";
import { RootStackScreenProps } from "@/types";

export default function AboutScreen({ route, navigation }: RootStackScreenProps<"About">) {
  return (
    <View style={styles.container}>
      <AboutItem
        title="反馈串"
        onPress={() => {
          navigation.navigate("Post", {
            id: 141412,
            title: "Po.141412",
          });
        }}
      />
      <AboutItem
        title="Github"
        onPress={() => {
          Linking.openURL("https://github.com/tiamed/bog-nimingban");
        }}
      />
      <AboutItem
        title="加载语录"
        onPress={() => {
          Linking.openURL("https://github.com/tiamed/bog-slang");
        }}
      />
      <AboutItem
        title="安卓安装包 (br65)"
        onPress={() => {
          Linking.openURL("https://wwz.lanzouf.com/b01v7e4ng");
        }}
      />
      <AboutItem
        title="支持BTM"
        onPress={() => {
          Linking.openURL("https://afdian.net/@kaiki");
        }}
      />
      <AboutItem
        title="支持粉岛"
        onPress={() => {
          Linking.openURL("https://afdian.net/@tiamed");
        }}
      />
      <AboutItem title="检查更新" onPress={manualUpdate} />
    </View>
  );
}

function AboutItem(props: { title: string; onPress?: () => void }) {
  const underlayColor = useThemeColor({}, "inactive");
  const tintColor = useThemeColor({}, "tint");
  return (
    <TouchableHighlight underlayColor={underlayColor} style={styles.item} onPress={props.onPress}>
      <Text style={{ color: tintColor }}>{props.title}</Text>
    </TouchableHighlight>
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
