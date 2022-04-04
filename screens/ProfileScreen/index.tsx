import { StyleSheet } from "react-native";

import { ScrollView } from "../../components/Themed";
import { RootTabScreenProps } from "../../types";
import Cookie from "./Cookie";
import Settings from "./Settings";

export default function ProfileScreen({
  navigation,
}: RootTabScreenProps<"Profile">) {
  return (
    <ScrollView style={{ flex: 1, flexDirection: "column" }}>
      <Cookie></Cookie>
      <Settings></Settings>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
