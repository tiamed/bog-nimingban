import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import { Button, Text, View } from "../components/Themed";
import ThreadPost from "../components/Post/ThreadPost";
import { RootStackScreenProps } from "../types";
import { getReply } from "../api";
import Overlay from "../components/Overlay";

export default function QuoteModalScreen({
  route,
  navigation,
}: RootStackScreenProps<"QuoteModal">) {
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
      <Overlay></Overlay>
      <View style={styles.modal}>
        <TextInput
          value={query}
          onChangeText={(val) => setQuery(val)}
          style={styles.input}
        ></TextInput>
        <View style={styles.group}>
          <Button
            title="取消"
            onPress={() => {
              navigation.goBack();
            }}
          ></Button>
          <Button title="跳转串号" onPress={confirm}></Button>
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
    backgroundColor: "#eee",
  },
  group: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
