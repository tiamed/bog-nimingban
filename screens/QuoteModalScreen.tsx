import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useAtom } from "jotai";

import { Text, useThemeColor, View } from "../components/Themed";
import ThreadPost from "../components/Post/ThreadPost";
import { RootStackScreenProps } from "../types";
import { getReply, Post, Reply } from "../api";
import { currentPostAtom } from "../atoms";
import Overlay from "../components/Overlay";
import Toast from "react-native-root-toast";

export default function QuoteModalScreen({
  route,
  navigation,
}: RootStackScreenProps<"QuoteModal">) {
  const [data, setData] = useState<Reply>({ content: "加载中..." } as Reply);
  const [currentPost] = useAtom<Post>(currentPostAtom);
  const loadData = async () => {
    try {
      const {
        data: { info },
      } = await getReply(route.params.id as number);
      if (typeof info === "string") {
        return;
      } else {
        setData(info);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    loadData();
  }, [route]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#40404040",
      }}
    >
      <Overlay></Overlay>
      <ThreadPost
        data={data}
        onPress={() => {
          if (currentPost.id === data.res) {
            Toast.show("已在当前串");
          } else {
            navigation.push("Post", {
              id: data.res || data.id,
              title: "",
            });
          }
        }}
      ></ThreadPost>
    </View>
  );
}

const styles = StyleSheet.create({
  actionWrapper: {
    padding: 10,
    paddingBottom: 0,
    alignItems: "flex-end",
    width: "100%",
  },
  action: {
    fontSize: 14,
  },
});
