import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useAtom } from "jotai";

import { Text, View, useThemeColor } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { Post, getPostsByForum } from "../api";
import ThreadPost from "../components/ThreadPost";
import { renderFooter } from "./HomeScreen";
import { historyAtom } from "../atoms";

export interface UserHistory extends Post {
  createTime: number;
  currentPage: number;
}

export default function HistoryScreen({
  route,
  navigation,
}: RootTabScreenProps<"History">) {
  const [history] = useAtom<UserHistory[]>(historyAtom);

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={({ item }) =>
          item && (
            <ThreadPost
              key={(item as unknown as Post).id}
              data={item as unknown as Post}
            />
          )
        }
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter.bind(null, false, true)}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
