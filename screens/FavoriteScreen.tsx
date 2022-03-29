import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useAtom } from "jotai";

import { Text, View, useThemeColor } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { Post, getPostsByForum } from "../api";
import ThreadPost from "../components/Post/ThreadPost";
import { renderFooter } from "./HomeScreen";
import { favoriteAtom } from "../atoms";

export interface UserFavorite extends Post {
  createTime: number;
}

export default function FavoriteScreen({
  route,
  navigation,
}: RootTabScreenProps<"Favorite">) {
  const [favorite] = useAtom<UserFavorite[]>(favoriteAtom);

  return (
    <View style={styles.container}>
      <FlatList
        data={favorite}
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
