import { useAtom, useSetAtom } from "jotai";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, FlatList, FlatListProps, InteractionManager } from "react-native";
import { useIsMounted } from "usehooks-ts";

import SearchFloatingAction from "./SearchFloatingAction";

import { getSearchResults, Reply, Image, Post } from "@/api";
import { previewIndexAtom, previewsAtom, searchForumFilterAtom } from "@/atoms";
import { getImageUrl, getThumbnailUrl } from "@/components/Post/ImageView";
import ReplyPost from "@/components/Post/ReplyPost";
import { View } from "@/components/Themed";
import renderFooter from "@/screens/HomeScreen/renderFooter";
import { RootStackScreenProps } from "@/types";

export default function SearchScreen({ route, navigation }: RootStackScreenProps<"Search">) {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Reply[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Reply[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNoMore, setHasNoMore] = useState(false);
  const [searchForumFilter] = useAtom(searchForumFilterAtom);
  const setPreviews = useSetAtom(previewsAtom);
  const setPreviewIndex = useSetAtom(previewIndexAtom);
  const listRef = useRef<any>(null);
  const isMounted = useIsMounted();
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
      const newResults = info
        ?.map(({ reply, ...rest }) => {
          return rest.content?.includes(query)
            ? [rest as Reply, ...reply.map((x) => ({ ...x, forum: rest.forum }))]
            : reply.map((x) => ({ ...x, forum: rest.forum }));
        })
        ?.flat();
      if (page === 1) {
        setPosts(newResults);
      } else {
        setPosts([...posts, ...newResults.filter((post) => !posts.find((x) => x.id === post.id))]);
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
        setPreviewIndex(data.images.findIndex((item) => item.url === image.url));
        navigation.navigate("PreviewModal");
      }}
    />
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
    if (searchForumFilter?.length && posts?.length) {
      setIsRefreshing(true);
      InteractionManager.runAfterInteractions(() => {
        setFilteredPosts(
          posts?.filter((post) => searchForumFilter.includes((post as unknown as Post).forum))
        );
        setIsRefreshing(false);
      });
    } else {
      setFilteredPosts(posts);
    }
  }, [searchForumFilter, posts]);

  return (
    <>
      <View style={styles.container}>
        <FlatList
          ref={listRef}
          data={filteredPosts}
          refreshing={isRefreshing}
          onRefresh={refreshPosts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() => renderFooter(isLoading, hasNoMore)}
        />
      </View>
      <SearchFloatingAction />
    </>
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
