import { StyleSheet, FlatList } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";

import { Text, View, useThemeColor } from "../../components/Themed";
import {
  threadAtom,
  tabRefreshingAtom,
  maxLineAtom,
  showHomeActionModalAtom,
  blackListPostsAtom,
} from "../../atoms";
import { RootTabScreenProps } from "../../types";
import { Post, getPostsByForum } from "../../api";
import ThreadPost from "../../components/Post/ThreadPost";
import { useForumsIdMap } from "../../hooks/useForums";
import HomeFloatingAction from "./HomeFloatingAction";
import ActionModal from "./ActionModal";
import renderFooter from "./renderFooter";

export default function HomeScreen({
  route,
  navigation,
}: RootTabScreenProps<"Home">) {
  const forumsIdMap = useForumsIdMap();
  const [thread] = useAtom(threadAtom);
  const [tabRefreshing, setTabRefreshing] = useAtom(tabRefreshingAtom);
  const [maxLine] = useAtom(maxLineAtom);
  const setShowHomeActionModal = useSetAtom(showHomeActionModalAtom);
  const [blackListPosts] = useAtom(blackListPostsAtom);

  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNoMore, setHasNoMore] = useState(false);
  const [focusItem, setFocusItem] = useState({} as Post);
  const listRef = React.useRef<any>(null);
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

  useEffect(() => {
    setFilteredPosts(
      posts?.filter((post) => !blackListPosts.includes(post.id))
    );
  }, [posts]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={filteredPosts}
        refreshing={isRefreshing}
        onRefresh={refreshPosts}
        renderItem={({ item }) => (
          <ThreadPost
            key={item.id}
            data={item}
            maxLine={maxLine}
            onLongPress={(item) => {
              setFocusItem(item as Post);
              setShowHomeActionModal(true);
            }}
          />
        )}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter.bind(null, isLoading, hasNoMore)}
      ></FlatList>
      <HomeFloatingAction></HomeFloatingAction>
      <ActionModal item={focusItem}></ActionModal>
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
