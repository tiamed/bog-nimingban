import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import { getReply, Post, Reply } from "@/api";
import { currentPostAtom } from "@/atoms";
import Overlay from "@/components/Overlay";
import ThreadPost from "@/components/Post/ThreadPost";
import { View } from "@/components/Themed";
import { RootStackScreenProps } from "@/types";

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
    <View style={styles.modal}>
      <Overlay />
      <ThreadPost
        data={data}
        onPress={() => {
          if (currentPost.id === data.res) {
            Toast.show({ type: "success", text1: "已在当前串" });
          } else {
            navigation.push("Post", {
              id: data.res || data.id,
              title: "",
            });
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#40404040",
  },
});
