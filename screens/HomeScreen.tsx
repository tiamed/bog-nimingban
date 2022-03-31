import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { FloatingAction } from "react-native-floating-action";

import { Text, View, useThemeColor } from "../components/Themed";
import { threadAtom, tabRefreshingAtom } from "../atoms";
import { RootTabScreenProps } from "../types";
import { Post, getPostsByForum } from "../api";
import ThreadPost from "../components/Post/ThreadPost";
import Loadings from "../constants/Loadings";
import { useForumsIdMap } from "../hooks/useForums";
import TabBarIcon from "../components/TabBarIcon";

export default function HomeScreen({
  route,
  navigation,
}: RootTabScreenProps<"Home">) {
  const forumsIdMap = useForumsIdMap();
  const [thread] = useAtom(threadAtom);
  const [tabRefreshing, setTabRefreshing] = useAtom(tabRefreshingAtom);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNoMore, setHasNoMore] = useState(false);
  const listRef = React.useRef<any>(null);
  const tintColor = useThemeColor({}, "tint");
  const loadData = async (page: number) => {
    setPage(page);
    try {
      setIsLoading(true);
      const {
        data: { info },
      } = await getPostsByForum(thread as unknown as number, page);
      if (typeof info === "string") {
        setHasNoMore(true);
        return;
      }
      if (page === 1) {
        setPosts(info);
      } else {
        setPosts([
          ...posts,
          ...info.filter((post) => !posts.find((x) => x.id === post.id)),
        ]);
      }
    } finally {
      setIsLoading(false);
      setTabRefreshing(false);
    }
  };
  const refreshPosts = useCallback(async () => {
    setIsRefreshing(true);
    await loadData(1);
    setIsRefreshing(false);
  }, [thread]);
  const loadMoreData = async () => {
    if (isLoading || hasNoMore) return;
    loadData(page + 1);
  };
  const updateTitle = () => {
    if (thread !== null) {
      navigation.setOptions({
        title: forumsIdMap.get(thread as number),
      });
    }
  };

  const onPressFAB = (action: string | undefined) => {
    switch (action) {
      case "post":
        navigation.navigate("ReplyModal", {
          forumId: thread,
        });
        break;
      case "search":
        navigation.navigate("SearchModal");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setHasNoMore(false);
    if (thread !== null) {
      refreshPosts().then(() => {
        if (listRef && listRef.current) {
          listRef.current.scrollToOffset({ animated: false, offset: 0 });
        }
      });
    }
  }, [thread]);

  useEffect(() => {
    if (tabRefreshing) {
      if (listRef && listRef.current) {
        listRef.current.scrollToOffset({ animated: false, offset: 0 });
      }
      refreshPosts();
    }
  }, [tabRefreshing]);

  useEffect(() => {
    updateTitle();
  }, [forumsIdMap, thread]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={posts}
        refreshing={isRefreshing}
        onRefresh={refreshPosts}
        renderItem={({ item }) => (
          <ThreadPost key={item.id} data={item} maxLine={10} />
        )}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter.bind(null, isLoading, hasNoMore)}
      ></FlatList>
      <FloatingAction
        color={tintColor}
        actions={[
          {
            icon: <TabBarIcon name="edit" color="white" />,
            name: "post",
            color: tintColor,
          },
          {
            icon: <TabBarIcon name="search" color="white" />,
            name: "search",
            color: tintColor,
          },
        ]}
        onPressItem={onPressFAB}
      ></FloatingAction>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export function renderFooter(
  loading: boolean = false,
  hasNoMore: boolean = false,
  loadMore: () => void = () => {}
) {
  const [randomIndex, setRadomIndex] = useState(0);
  const onPress = useCallback(() => {
    if (!loading && typeof loadMore === "function") {
      loadMore();
    }
  }, [loadMore]);
  const LoadingText = useMemo(() => {
    if (loading) {
      return Loadings[randomIndex];
    } else {
      return hasNoMore ? "已经没有更多了" : "下拉加载更多";
    }
    return "";
  }, [loading, hasNoMore, randomIndex]);
  useEffect(() => {
    setRadomIndex((Loadings.length * Math.random()) | 0);
  }, []);
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <Text lightColor="#666666" darkColor="#999999">
          {LoadingText}
        </Text>
        {loading && (
          <ActivityIndicator
            size="small"
            color={useThemeColor({}, "tint")}
            style={{ marginLeft: 10 }}
          ></ActivityIndicator>
        )}
      </View>
    </Pressable>
  );
}
