import { useAtom, useSetAtom } from "jotai";
import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, FlatList, FlatListProps, Platform } from "react-native";

import ActionModal from "./ActionModal";
import HomeFloatingAction from "./HomeFloatingAction";
import renderFooter from "./renderFooter";

import { ThreadPostConfigContext } from "@/Provider";
import { Post, getPostsByForum } from "@/api";
import {
  threadAtom,
  tabRefreshingAtom,
  maxLineAtom,
  showHomeActionModalAtom,
  blackListPostsAtom,
  showThreadReplyAtom,
  blackListForumsAtom,
  blackListCookiesAtom,
  expandableAtom,
  blackListWordsAtom,
  clickableAtom,
} from "@/atoms";
import ThreadPost from "@/components/Post/ThreadPost";
import { View } from "@/components/Themed";
import { useForumsIdMap } from "@/hooks/useForums";
import { RootTabScreenProps } from "@/types";

export default function HomeScreen({ route, navigation }: RootTabScreenProps<"HomeMain">) {
  const forumsIdMap = useForumsIdMap();
  const [thread, setThread] = useAtom(threadAtom);
  const [tabRefreshing, setTabRefreshing] = useAtom(tabRefreshingAtom);
  const [maxLine] = useAtom(maxLineAtom);
  const [expandable] = useAtom(expandableAtom);
  const [clickable] = useAtom(clickableAtom);
  const setShowHomeActionModal = useSetAtom(showHomeActionModalAtom);
  const [blackListPosts] = useAtom(blackListPostsAtom);
  const [blackListCookies] = useAtom(blackListCookiesAtom);
  const [blackListForums] = useAtom(blackListForumsAtom);
  const [blackListWords] = useAtom(blackListWordsAtom);
  const [showThreadReply] = useAtom(showThreadReplyAtom);

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
        setPosts([...posts, ...info.filter((post) => !posts.find((x) => x.id === post.id))]);
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

  const renderItem: FlatListProps<Post>["renderItem"] = ({ item }) => (
    <ThreadPost
      key={item.id}
      data={item}
      maxLine={maxLine}
      onLongPress={(item) => {
        setFocusItem(item as Post);
        setShowHomeActionModal(true);
      }}
      gestureEnabled={Platform.OS === "ios"}
      showReply={showThreadReply}
    />
  );

  const keyExtractor = (item: Post) => item.id.toString();

  useEffect(() => {
    setHasNoMore(false);
    if (thread !== null) {
      if (filteredPosts.length === 0) {
        loadData(1);
      } else {
        refreshPosts().then(() => {
          if (listRef && listRef.current) {
            listRef.current.scrollToOffset({ animated: false, offset: 0 });
          }
        });
      }
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
    if (route.params?.thread !== undefined) {
      setTimeout(() => {
        setThread(route.params.thread);
      }, 200);
    }
  }, [route.params?.thread]);

  useEffect(() => {
    let filtered = posts;
    if (blackListForums?.length && thread === 0) {
      filtered = filtered.filter((post) => !blackListForums.includes(post.forum));
    }
    if (blackListCookies?.length) {
      filtered = filtered.filter((post) => !blackListCookies.includes(post.cookie));
    }
    if (blackListPosts?.length) {
      filtered = filtered.filter((post) => !blackListPosts.includes(post.id));
    }
    if (blackListWords?.length) {
      filtered = filtered.filter(
        (post) =>
          !blackListWords.some((word: string) =>
            [post.title, post.name, post.content].some((content) => RegExp(word, "i").test(content))
          )
      );
    }
    setFilteredPosts(filtered);
  }, [posts]);

  return (
    <ThreadPostConfigContext.Provider value={{ expandable, clickable }}>
      <View style={styles.container}>
        <FlatList
          ref={listRef}
          data={filteredPosts}
          refreshing={isRefreshing}
          onRefresh={refreshPosts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            renderFooter({
              loading: isLoading,
              hasNoMore,
            })
          }
        />
        <HomeFloatingAction />
        <ActionModal item={focusItem} />
      </View>
    </ThreadPostConfigContext.Provider>
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
