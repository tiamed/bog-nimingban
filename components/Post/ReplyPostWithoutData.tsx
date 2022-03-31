import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useAtom } from "jotai";

import { Text, useThemeColor, View } from "../Themed";
import ReplyPost from "./ReplyPost";
import { getReply, Post, Reply } from "../../api";
import { currentPostAtom } from "../../atoms";
import { useNavigation } from "@react-navigation/native";
import useSize from "../../hooks/useSize";

export default function ReplyPostWithoutData(props: {
  id: number;
  width: string | number;
  level: number;
}) {
  const mounted = useRef(false);
  const [data, setData] = useState<Reply>({ content: "加载中..." } as Reply);
  const [currentPost] = useAtom<Post>(currentPostAtom);
  const tintColor = useThemeColor({}, "tint");
  const navigation = useNavigation();
  const BASE_SIZE = useSize();

  const loadData = async () => {
    try {
      const {
        data: { info },
      } = await getReply(props.id);
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
    mounted.current = true;

    if (mounted.current) {
      loadData().then(() => {});
    }

    return () => {
      mounted.current = false;
    };
  }, [props.id]);
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "flex-end",
        alignContent: "stretch",
      }}
    >
      <View style={styles.actionWrapper}>
        <TouchableOpacity
          onPress={() => {
            navigation.push("Post", {
              id: data.res || data.id,
              title: "",
            });
          }}
          disabled={currentPost.id === data.res}
        >
          <Text
            style={{
              fontSize: BASE_SIZE * 0.8,
            }}
            lightColor={tintColor}
            darkColor={tintColor}
          >
            {currentPost.id === data.res ? "当前串" : "查看原串"}
          </Text>
        </TouchableOpacity>
      </View>
      <ReplyPost
        data={data}
        po={currentPost.cookie}
        width={props.width}
        level={props.level}
      ></ReplyPost>
    </View>
  );
}

const styles = StyleSheet.create({
  actionWrapper: {
    paddingRight: 10,
  },
});
