import { useState } from "react";
import { StyleSheet } from "react-native";

import Overlay from "@/components/Overlay";
import { Button, View, TextInput } from "@/components/Themed";
import { RootStackScreenProps } from "@/types";

export default function SearchModalScreen({
  route,
  navigation,
}: RootStackScreenProps<"SearchModal">) {
  const [query, setQuery] = useState("");
  const confirm = () => {
    navigation.goBack();
    navigation.navigate("Post", {
      id: Number(query),
      title: `Po.${query}`,
    });
  };

  return (
    <View style={styles.container}>
      <Overlay />
      <View style={styles.modal}>
        <TextInput value={query} onChangeText={(val) => setQuery(val)} style={styles.input} />
        <View style={styles.group}>
          <Button
            title="取消"
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Button title="跳转串号" onPress={confirm} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: "10%",
    backgroundColor: "#40404040",
  },
  modal: {
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 10,
    overflow: "hidden",
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 30,
  },
  group: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
