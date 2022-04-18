import { useSetAtom } from "jotai";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, FlatList, FlatListProps } from "react-native";

import { getSearchResults, Reply, Image } from "@/api";
import { previewIndexAtom, previewsAtom } from "@/atoms";
import { getImageUrl, getThumbnailUrl } from "@/components/Post/ImageView";
import ReplyPost from "@/components/Post/ReplyPost";
import { View } from "@/components/Themed";
import renderFooter from "@/screens/HomeScreen/renderFooter";
import { RootStackScreenProps } from "@/types";

export default function HomeScreen({ route, navigation }: RootStackScreenProps<"Search">) {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Reply[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNoMore, setHasNoMore] = useState(false);
  const setPreviews = useSetAtom(previewsAtom);
  const setPreviewIndex = useSetAtom(previewIndexAtom);
  const listRef = useRef<any>(null);
  const loadData = async (page: number) => {
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
          return rest.content?.includes(query) ? [rest as Reply, ...reply] : reply;
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

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={posts}
        refreshing={isRefreshing}
        onRefresh={refreshPosts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => renderFooter(isLoading, hasNoMore)}
      />
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
