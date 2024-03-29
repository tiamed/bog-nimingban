import { useContext, useState } from "react";
import { Linking, StyleSheet, TouchableHighlight } from "react-native";

import { SizeContext } from "@/Provider";
import ChangelogModal from "@/components/ChangelogModal";
import { View, Text, useThemeColor } from "@/components/Themed";
import Urls from "@/constants/Urls";
import { manualUpdate } from "@/tasks/checkAppUpdate";
import { RootStackScreenProps } from "@/types";
import { getVersion } from "@/utils/update";

export default function AboutScreen({ route, navigation }: RootStackScreenProps<"About">) {
  const [changelogVisible, setChangelogVisible] = useState(false);
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
          Linking.openURL(Urls.github.bog);
        }}
      />
      <AboutItem
        title="加载语录"
        onPress={() => {
          Linking.openURL(Urls.github.slang);
        }}
      />
      <AboutItem
        title="安卓安装包 (br65)"
        onPress={() => {
          Linking.openURL(Urls.lanzou);
        }}
      />
      <AboutItem
        title="支持BTM"
        onPress={() => {
          Linking.openURL(Urls.afdian.btm);
        }}
      />
      <AboutItem
        title="支持粉岛"
        onPress={() => {
          Linking.openURL(Urls.afdian.bog);
        }}
      />
      <AboutItem
        title="更新日志"
        onPress={() => {
          setChangelogVisible(true);
        }}
      />
      <AboutItem
        title="检查更新"
        desc={`当前版本：${getVersion()}`}
        onPress={() => {
          manualUpdate();
        }}
      />
      <ChangelogModal visible={changelogVisible} onClose={() => setChangelogVisible(false)} />
    </View>
  );
}

function AboutItem(props: { title: string; desc?: string; onPress?: () => void }) {
  const underlayColor = useThemeColor({}, "inactive");
  const tintColor = useThemeColor({}, "tint");
  const BASE_SIZE = useContext(SizeContext);
  return (
    <TouchableHighlight underlayColor={underlayColor} onPress={props.onPress}>
      <View style={styles.item}>
        <Text style={{ color: tintColor }}>{props.title}</Text>
        {props.desc && (
          <Text style={{ color: underlayColor, fontSize: BASE_SIZE * 0.8 }}>{props.desc}</Text>
        )}
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  item: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});
