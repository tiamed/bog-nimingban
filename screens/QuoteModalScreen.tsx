import { StatusBar } from "expo-status-bar";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";
import { previewsAtom } from "../atoms";

import { Text, View } from "../components/Themed";
import ThreadPost from "../components/ThreadPost";
import { RootStackScreenProps } from "../types";
import { getReply } from "../api";

export default function QuoteModalScreen({
  route,
  navigation,
}: RootStackScreenProps<"QuoteModal">) {
  const [data, setData] = useState({ content: "加载中..." });
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
      <TouchableOpacity
        style={{
          flex: 1,
          width: "80%",
          justifyContent: "center",
        }}
        onPressOut={() => {
          navigation.goBack();
        }}
      >
        <ThreadPost data={data}></ThreadPost>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
