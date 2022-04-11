import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSetAtom } from "jotai";
import { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import BackupModal from "./BackupModal";
import { showBackupModalAtom } from "./common";

import { SizeContext } from "@/components/ThemeContextProvider";
import { Text, useThemeColor } from "@/components/Themed";
import { RootStackParamList } from "@/types";

export default function Settings() {
  const BASE_SIZE = useContext(SizeContext);
  const setShowBackupModal = useSetAtom(showBackupModalAtom);
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: BASE_SIZE * 1.25 }]}>应用设置</Text>
      <JumpToSettings title="显示设置" navigateTo="LayoutSettings" />
      <JumpToSettings title="屏蔽串设置" navigateTo="BlackList" />
      <SettingItem title="备份设置" onPress={() => setShowBackupModal(true)} />
      <JumpToSettings title="关于" navigateTo="About" />
      <BackupModal />
    </View>
  );
}

function SettingItem(props: { title: string; onPress: () => void }) {
  const tintColor = useThemeColor({}, "tint");
  const BASE_SIZE = useContext(SizeContext);
  return (
    <View>
      <TouchableOpacity style={styles.item} onPress={props.onPress}>
        <Text style={{ ...styles.itemLabel, color: tintColor }}>{props.title}</Text>
        <FontAwesome name="chevron-right" color={tintColor} size={BASE_SIZE} />
      </TouchableOpacity>
    </View>
  );
}

function JumpToSettings(props: { title: string; navigateTo: keyof RootStackParamList }) {
  const navigation = useNavigation();
  return (
    <SettingItem
      title={props.title}
      onPress={() => {
        navigation.navigate(props.navigateTo);
      }}
    />
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
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    height: 40,
    paddingRight: 20,
  },
  itemLabel: {
    minWidth: "20%",
  },
});
