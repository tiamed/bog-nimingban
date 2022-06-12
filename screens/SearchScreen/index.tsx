import { useAtom, useSetAtom } from "jotai";
import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { StyleSheet, FlatList, FlatListProps, InteractionManager } from "react-native";
import { useIsMounted } from "usehooks-ts";

import SearchFloatingAction from "./SearchFloatingAction";

import { ThreadPostConfigContext, GroupSearchResultContext } from "@/Provider";
import { getSearchResults, Reply, Image, Post } from "@/api";
import {
  maxLineAtom,
  previewUrlAtom,
  previewsAtom,
  searchForumFilterAtom,
  expandableAtom,
  clickableAtom,
} from "@/atoms";
import { getImageUrl, getThumbnailUrl } from "@/components/Post/ImageView";
import ReplyPost from "@/components/Post/ReplyPost";
import ThreadPost from "@/components/Post/ThreadPost";
import { View } from "@/components/Themed";
import renderFooter from "@/screens/HomeScreen/renderFooter";
import { RootStackScreenProps } from "@/types";

export default function SearchScreen({ route, navigation }: RootStackScreenProps<"Search">) {
  const [query, setQuery] = useState("");
  const [replies, setReplies] = useState<Reply[]>([]);
  const [filteredReplies, setFilteredReplies] = useState<Reply[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNoMore, setHasNoMore] = useState(false);

  const [maxLine] = useAtom(maxLineAtom);
  const [searchForumFilter] = useAtom(searchForumFilterAtom);
  const setPreviews = useSetAtom(previewsAtom);
  const setPreviewUrl = useSetAtom(previewUrlAtom);
  const [expandable] = useAtom(expandableAtom);
  const [clickable] = useAtom(clickableAtom);
  const listRef = useRef<any>(null);
  const isMounted = useIsMounted();
  const groupSearchResults = useContext(GroupSearchResultContext);
  const loadData = async (page: number) => {
    if (!isMounted) return;
    setPage(page);
    try {
      setIsLoading(true);
      const {
        data: { info },
      } = await getSearchResults(query, page);
      if (!info || typeof info === "string") {
        setHasNoMore(true);
        return;
      }

      if (groupSearchResults) {
        const newResults = info;
        if (page === 1) {
          setPosts(newResults as Post[]);
        } else {
          setPosts([
            ...posts,
            ...newResults.filter((post) => !posts.find((x) => x.id === post.id)),
          ] as Post[]);
        }
      } else {
        const newResults = info
          ?.map(({ reply, ...rest }) => {
            return rest.content?.includes(query)
              ? [rest as Reply, ...reply.map((x) => ({ ...x, forum: rest.forum }))]
              : reply.map((x) => ({ ...x, forum: rest.forum }));
          })
          ?.flat();
        if (page === 1) {
          setReplies(newResults);
        } else {
          setReplies([
            ...replies,
            ...newResults.filter((post) => !replies.find((x) => x.id === post.id)),
          ]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPosts = useCallback(async () => {
    setIsRefreshing(true);
    await loadData(1);
    setIsRefreshing(false);
  }, [query]);
  const loadMoreData = async () => {
    if (isLoading || hasNoMore) return;
    loadData(page + 1);
  };
  const updateTitle = () => {
    if (query) {
      navigation.setOptions({
        title: `搜索结果：${query}`,
      });
    }
  };

  const renderItem: FlatListProps<Reply>["renderItem"] = ({ item: data }) => (
    <ReplyPost
      key={data.id}
      data={data}
      onPress={() => {
        navigation.navigate("Post", {
          id: data.res || data.id,
          title: `Po.${data.res || data.id}`,
        });
      }}
      onImagePress={(image: Image) => {
        setPreviews(
          data.images.map((item) => ({
            url: getImageUrl(item),
            originalUrl: getThumbnailUrl(item),
          }))
        );
        setPreviewUrl(getImageUrl(image));
        navigation.navigate("PreviewModal");
      }}
      withPadding
    />
  );

  const renderItemPosts: FlatListProps<Post>["renderItem"] = ({ item }) => (
    <ThreadPost key={item.id} data={item} maxLine={maxLine} showReply />
  );

  const keyExtractor = (item: Reply) => item.id.toString();

  useEffect(() => {
    if (route.params?.query && route.params.query !== query) {
      setQuery(route.params.query);
    }
  }, [route.params]);

  useEffect(() => {
    updateTitle();
    setHasNoMore(false);
    if (query) {
      refreshPosts().then(() => {
        if (listRef && listRef.current) {
          listRef.current.scrollToOffset({ animated: false, offset: 0 });
        }
      });
    }
  }, [query]);

  useEffect(() => {
    if (!isMounted) return;
    if (searchForumFilter?.length && replies?.length) {
      setIsRefreshing(true);
      InteractionManager.runAfterInteractions(() => {
        setFilteredReplies(
          replies?.filter((post) => searchForumFilter.includes((post as unknown as Post).forum))
        );
        setIsRefreshing(false);
      });
    } else {
      setFilteredReplies(replies);
    }
  }, [searchForumFilter, replies]);

  useEffect(() => {
    if (!isMounted) return;
    if (searchForumFilter?.length && posts?.length) {
      setIsRefreshing(true);
      InteractionManager.runAfterInteractions(() => {
        setFilteredPosts(posts?.filter((post) => searchForumFilter.includes(post.forum)));
        setIsRefreshing(false);
      });
    } else {
      setFilteredPosts(posts);
    }
  }, [searchForumFilter, posts]);

  return (
    <ThreadPostConfigContext.Provider value={{ expandable, clickable }}>
      <View style={styles.container}>
        {groupSearchResults ? (
          <FlatList
            ref={listRef}
            data={filteredPosts}
            refreshing={isRefreshing}
            onRefresh={refreshPosts}
            renderItem={renderItemPosts}
            keyExtractor={keyExtractor}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() =>
              renderFooter({
                loading: isLoading,
                hasNoMore,
                empty: !filteredPosts.length,
              })
            }
          />
        ) : (
          <FlatList
            ref={listRef}
            data={filteredReplies}
            refreshing={isRefreshing}
            onRefresh={refreshPosts}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() =>
              renderFooter({
                loading: isLoading,
                hasNoMore,
                empty: !filteredReplies.length,
              })
            }
          />
        )}
      </View>
      <SearchFloatingAction />
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
