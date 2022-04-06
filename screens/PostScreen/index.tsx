import { useFocusEffect } from "@react-navigation/native";
import { useAtom, useSetAtom } from "jotai";
import { useState, useEffect, useCallback, useMemo } from "react";
import { StyleSheet, FlatList, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ActionModal from "./ActionModal";
import Footer from "./Footer";
import PageModal from "./PageModal";

import { Reply, getPostById, Post } from "@/api";
import {
  historyAtom,
  previewsAtom,
  draftAtom,
  showActionModalAtom,
  currentPostAtom,
  postIdRefreshingAtom,
  postFilteredAtom,
  orderAtom,
} from "@/atoms/index";
import { getImageUrl, getThumbnailUrl } from "@/components/Post/ImageView";
import ReplyPost from "@/components/Post/ReplyPost";
import { View } from "@/components/Themed";
import { useForumsIdMap } from "@/hooks/useForums";
import { UserHistory } from "@/screens//BrowseHistoryScreen";
import renderFooter from "@/screens/HomeScreen/renderFooter";
import { RootStackScreenProps } from "@/types";

export default function PostScreen({ route, navigation }: RootStackScreenProps<"Post">) {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<Reply[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Reply[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [firstPage, setFirstPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNoMore, setHasNoMore] = useState(false);
  const [lastPageFinished, setLastPageFinished] = useState(false);
  const [focusItem, setFocusItem] = useState({} as Reply);
  const [isShowFooter, setIsShowFooter] = useState(true);
  const [lastContentOffset, setLastContentOffset] = useState(0);

  const [postIdRefreshing, setPostIdRefreshing] = useAtom(postIdRefreshingAtom);
  const setPreviews = useSetAtom(previewsAtom);
  const [history, setHistory] = useAtom<UserHistory[], UserHistory[], void>(historyAtom);
  const [mainPost, setMainPost] = useAtom<Post, Post, void>(currentPostAtom);
  const [postFiltered] = useAtom(postFilteredAtom);
  const [order] = useAtom(orderAtom);

  const setShowActionModal = useSetAtom(showActionModalAtom);
  const setDraft = useSetAtom(draftAtom);
  const forumsIdMap = useForumsIdMap();
  const images = useMemo(() => {
    return posts.map((x) => x.images || []).flat();
  }, [posts]);

  const loadData = async (nextPage: number, jump: boolean = false) => {
    try {
      setIsLoading(true);
      const {
        data: {
          type,
          info: { reply, ...rest },
        },
      } = await getPostById(route.params.id as number, nextPage, 20, order);

      if (rest.id) {
        setMainPost(rest as Post);
      }

      if (type === "error") {
        setHasNoMore(true);
        return;
      }

      let nextPosts = nextPage === 1 ? [rest, ...reply] : [...reply];
      if (!jump) {
        nextPosts = nextPosts.filter((post) => !posts.find((x) => x.id === post.id));
      }

      if (jump) {
        setPosts(nextPosts);
        setFirstPage(nextPage);
        setLastPage(nextPage);
        setHasNoMore(reply?.length !== 20);
        setLastPageFinished(reply?.length === 20);
      } else {
        if (nextPage < firstPage) {
          setPosts([...nextPosts, ...posts]);
          setFirstPage(nextPage);
        } else {
          setPosts([...posts, ...nextPosts]);
          setLastPage(nextPage);
          setHasNoMore(reply?.length !== 20);
          setLastPageFinished(reply?.length === 20);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPosts = useCallback(async () => {
    setIsRefreshing(true);
    if (firstPage === 1) {
      await loadData(1);
    } else {
      await loadData(firstPage - 1);
    }
    setIsRefreshing(false);
  }, [firstPage, order]);

  const loadMoreData = async (force = false) => {
    if (isLoading || (hasNoMore && !force)) return;
    if (hasNoMore && !lastPageFinished) {
      loadData(lastPage);
    } else {
      loadData(lastPage + 1);
    }
  };

  const updatePreviews = () => {
    if (images.length) {
      setPreviews(
        images.map((item) => ({
          url: getImageUrl(item),
          originalUrl: getThumbnailUrl(item),
        }))
      );
    }
  };

  // 添加历史记录
  const addToHistory = () => {
    let newHistory = history.filter((x) => x.id) || [];
    if (history?.find((record: { id: number }) => record.id === route.params.id)) {
      newHistory = history.filter((record) => record.id !== route.params.id);
    }
    newHistory.unshift({
      ...mainPost,
      createTime: Date.now(),
      currentPage,
    });
    setHistory(newHistory);
  };

  useEffect(() => {
    if (history) {
      const current = history?.find((x) => x.id === route.params.id);
      setCurrentPage(current?.currentPage || 1);
      if (posts.length === 0) {
        loadData(current?.currentPage || 1, true);
      }
    }
  }, [history]);

  // 更新预览图集合
  useEffect(() => {
    updatePreviews();
  }, [images]);

  useFocusEffect(() => {
    updatePreviews();
  });

  // 更新历史记录
  useEffect(() => {
    if (mainPost.id === route.params.id && currentPage !== 0) {
      addToHistory();
      navigation.setOptions({
        title: `${forumsIdMap.get(mainPost.forum)} Po.${mainPost.id}`,
      });
    }
  }, [mainPost, currentPage]);

  // 更新当前查看页
  useEffect(() => {
    setCurrentPage(firstPage);
  }, [firstPage]);

  // 更新当前查看页
  useEffect(() => {
    setCurrentPage(lastPage);
  }, [lastPage]);

  // 更新标题及草稿
  useEffect(() => {
    navigation.setOptions({
      title: route.params.title,
    });
    setDraft("");
    return () => {
      setMainPost({} as Post);
    };
  }, [route.params.id]);

  useEffect(() => {
    if (postIdRefreshing === route.params.id) {
      if (order) {
        refreshPosts().then(() => {
          setPostIdRefreshing(-1);
        });
      } else {
        loadMoreData(true).then(() => {
          setPostIdRefreshing(-1);
        });
      }
    }
  }, [postIdRefreshing]);

  useEffect(() => {
    setFilteredPosts(posts.filter((post) => post.cookie === mainPost.cookie));
  }, [posts]);

  useEffect(() => {
    if (!isLoading) {
      setPosts([]);
      loadData(1, true);
    }
  }, [order]);

  return (
    <View style={{ ...styles.container, paddingBottom: insets.bottom }}>
      <FlatList
        data={postFiltered ? filteredPosts : posts}
        refreshing={isRefreshing}
        onRefresh={refreshPosts}
        onScroll={(e) => {
          const isScrollUp =
            Platform.OS === "ios"
              ? e.nativeEvent.contentOffset.y - lastContentOffset > 0
              : (e.nativeEvent.velocity?.y as number) > 0;
          const canHide = e.nativeEvent.contentSize.height > e.nativeEvent.layoutMeasurement.height;

          if (isScrollUp && e.nativeEvent.contentOffset.y > 5 && canHide) {
            if (isShowFooter) {
              setIsShowFooter(false);
            }
          } else if (
            e.nativeEvent.contentSize.height -
              e.nativeEvent.layoutMeasurement.height -
              e.nativeEvent.contentOffset.y >
            5
          ) {
            if (!isShowFooter) {
              setIsShowFooter(true);
            }
          }
          setLastContentOffset(e.nativeEvent.contentOffset.y);
        }}
        renderItem={({ item }) => (
          <ReplyPost
            key={item.id}
            data={item}
            po={mainPost.cookie}
            onPress={() => {
              setFocusItem(item);
              setShowActionModal(true);
            }}
          />
        )}
        onEndReached={() => loadMoreData(false)}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          renderFooter(isLoading, hasNoMore, loadMoreData.bind(null, true))
        }
      />

      <Footer id={route.params.id} mainPost={mainPost} visible={isShowFooter} />

      <PageModal index={currentPage} total={mainPost?.reply_count} loadData={loadData} />
      <ActionModal item={focusItem} postId={mainPost.id} forumId={mainPost.forum} />
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
});
