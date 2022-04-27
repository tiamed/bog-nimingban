import { useFocusEffect } from "@react-navigation/native";
import { useAtom, useSetAtom } from "jotai";
import { useState, useEffect, useCallback, useMemo, createContext, useRef } from "react";
import { StyleSheet, FlatList, Platform, FlatListProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDebouncedCallback } from "use-debounce";
import { useIsMounted } from "usehooks-ts";

import ActionModal from "./ActionModal";
import CheckUpdate from "./CheckUpdate";
import Footer from "./Footer";
import PageModal from "./PageModal";

import { Reply, getPostById, Post } from "@/api";
import {
  historyAtom,
  previewsAtom,
  draftAtom,
  postIdRefreshingAtom,
  orderAtom,
  selectionAtom,
} from "@/atoms/index";
import { getImageUrl, getThumbnailUrl } from "@/components/Post/ImageView";
import ReplyPost from "@/components/Post/ReplyPost";
import { View } from "@/components/Themed";
import Errors from "@/constants/Errors";
import { useForumsIdMap } from "@/hooks/useForums";
import usePostFiltered from "@/hooks/usePostFiltered";
import { UserHistory } from "@/screens//BrowseHistoryScreen";
import renderFooter from "@/screens/HomeScreen/renderFooter";
import { RootStackScreenProps } from "@/types";

export const MainPostContext = createContext({} as Post);

interface ReplyWithPage extends Reply {
  currentPage?: number;
}

export default function PostScreen({ route, navigation }: RootStackScreenProps<"Post">) {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<ReplyWithPage[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ReplyWithPage[]>([]);
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
  const [mainPost, setMainPost] = useState<Post>({} as Post);
  const [lastPosition, setLastPosition] = useState(0);
  const [currentHistory, setCurrentHistory] = useState({} as UserHistory);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showPageModal, setShowPageModal] = useState(false);

  const [postIdRefreshing, setPostIdRefreshing] = useAtom(postIdRefreshingAtom);
  const setPreviews = useSetAtom(previewsAtom);
  const [history, setHistory] = useAtom<UserHistory[], UserHistory[], void>(historyAtom);
  const [order] = useAtom(orderAtom);

  const setDraft = useSetAtom(draftAtom);
  const setSelection = useSetAtom(selectionAtom);
  const forumsIdMap = useForumsIdMap();
  const isMounted = useIsMounted();
  const { result: postFiltered, setCurrentId } = usePostFiltered(Number(route.params.id));

  const listRef = useRef<FlatList>(null);

  const images = useMemo(() => {
    return posts.map((x) => x.images || []).flat();
  }, [posts]);

  const onViewRef = useRef<FlatListProps<ReplyWithPage>["onViewableItemsChanged"]>(
    ({ viewableItems }) => {
      if (viewableItems.length) {
        const last = viewableItems[0];
        const { key, item } = last;
        const position = Number(key);
        if (lastPosition !== position && position) {
          const page = (item as ReplyWithPage)?.currentPage as number;
          setLastPosition(position || 0);
          setCurrentPage(page);
        }
      }
    }
  );
  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 10,
    minimumViewTime: 200,
    waitForInteraction: true,
  });

  const loadData = async (
    nextPage: number,
    jump: boolean = false,
    updatePosition: boolean = false
  ) => {
    if (!isMounted) return;
    try {
      setIsLoading(true);
      const {
        data: {
          type,
          code,
          info: { reply, ...rest },
        },
      } = await getPostById(route.params.id as number, nextPage, 20, order);

      if (rest.id) {
        setMainPost(rest as Post);
      }

      if (type === "error") {
        setHasNoMore(true);
        if (code !== 6202) {
          Toast.show({
            type: "error",
            text1: Errors[code],
          });
        }
        return;
      }

      const replyWithPage: ReplyWithPage[] = reply.map((x) => ({ ...x, currentPage: nextPage }));

      let nextPosts = nextPage === 1 ? [rest, ...replyWithPage] : [...replyWithPage];
      if (!jump) {
        nextPosts = nextPosts.filter((post) => !posts.find((x) => x.id === post.id));
      }

      if (jump) {
        setPosts(nextPosts);
        setFirstPage(nextPage);
        setLastPage(nextPage);
        setCurrentPage(nextPage);
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
      if (updatePosition) {
        setLastPosition(nextPosts[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPosts = useCallback(async () => {
    if (firstPage === 1) {
      setIsRefreshing(true);
      await loadData(1);
      setIsRefreshing(false);
    } else {
      await loadData(firstPage - 1);
    }
    addToHistory(true);
  }, [firstPage, order]);

  const debouncedRefreshPosts = useDebouncedCallback(refreshPosts, 1000, {
    leading: true,
    trailing: false,
  });

  const loadMoreData = async (force = false) => {
    if (isLoading || (hasNoMore && !force)) return;
    if (hasNoMore && !lastPageFinished) {
      await loadData(lastPage);
    } else {
      await loadData(lastPage + 1);
    }
    addToHistory(true);
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
  const addToHistory = (noPositionChange: boolean = false) => {
    if (!mainPost?.id) return;
    let newHistory = history.filter((x) => x.id) || [];
    const oldHistory = currentHistory;
    if (oldHistory) {
      newHistory = history.filter((record) => record.id && record.id !== route.params.id);
    }
    if (noPositionChange) {
      newHistory.unshift({
        ...mainPost,
        createTime: Date.now(),
        currentPage: oldHistory?.currentPage || currentPage,
        position: oldHistory?.position || lastPosition,
      });
    } else {
      newHistory.unshift({
        ...mainPost,
        createTime: Date.now(),
        currentPage,
        position: lastPosition,
      });
    }
    setHistory(newHistory);
  };

  const scrollToLastPosition = () => {
    if (listRef.current && currentHistory?.position && posts.length && !lastPosition) {
      const index = posts.findIndex((post) => post.id === currentHistory.position);
      if (index !== -1 && filteredPosts.length) {
        try {
          listRef.current.scrollToIndex({ animated: false, index, viewPosition: 0 });
        } catch (error) {
          console.warn(error);
        }
      }
    }
  };

  const onUpdate = async () => {
    if (order) {
      if (firstPage === 1) {
        await refreshPosts();
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
      } else {
        await loadData(1, true, true);
      }
    } else {
      const total = Math.ceil(mainPost.reply_count / 20);
      if (lastPage < total) {
        await loadData(total, true, true);
      } else {
        await loadMoreData(true);
        setTimeout(() => {
          listRef.current?.scrollToEnd({ animated: false });
        }, 200);
      }
    }
  };

  const renderItem = ({ item }: { item: ReplyWithPage }) => (
    <ReplyPost
      key={item.id}
      data={item}
      po={mainPost.cookie}
      onPress={() => {
        setFocusItem(item);
        setShowActionModal(true);
      }}
    />
  );

  const renderItemMemoized = useMemo(() => renderItem, [filteredPosts]);

  const keyExtractor = (item: any) => item.id.toString();

  useEffect(() => {
    if (history) {
      const current = history?.find((x) => x.id === route.params.id);
      if (current) {
        setCurrentHistory(current);
      }
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

  useEffect(() => {
    if (mainPost.id) {
      navigation.setOptions({
        title: `${forumsIdMap.get(mainPost.forum)} Po.${mainPost.id}`,
      });
      addToHistory(true);
    }
  }, [mainPost]);

  // 更新历史记录
  useEffect(() => {
    const shouldUpdate =
      currentHistory.currentPage !== currentPage || currentHistory.position !== lastPosition;
    if (lastPosition && mainPost.id === route.params.id && shouldUpdate) {
      addToHistory();
    }
  }, [currentPage, lastPosition, mainPost]);

  // 更新标题及草稿
  useEffect(() => {
    setCurrentId(route.params.id);
    setDraft("");
    setSelection({ start: 0, end: 0 });
    return () => {
      setMainPost({} as Post);
    };
  }, [route.params.id]);

  useEffect(() => {
    if (postIdRefreshing === route.params.id) {
      onUpdate().then(() => {
        setPostIdRefreshing(-1);
      });
    }
  }, [postIdRefreshing]);

  useEffect(() => {
    if (postFiltered) {
      setFilteredPosts(posts.filter((post) => post.cookie === mainPost.cookie));
    } else {
      setFilteredPosts(posts);
    }
  }, [posts, postFiltered]);

  useEffect(() => {
    if (!(isLoading || isRefreshing) && filteredPosts.length) {
      scrollToLastPosition();
    }
  }, [filteredPosts, isLoading, isRefreshing]);

  useEffect(() => {
    if (!isLoading) {
      setPosts([]);
      loadData(1, true);
    }
  }, [order]);

  return (
    <MainPostContext.Provider value={mainPost}>
      <View style={{ ...styles.container, paddingBottom: insets.bottom }}>
        <FlatList
          ref={listRef}
          data={filteredPosts}
          refreshing={isRefreshing}
          onRefresh={debouncedRefreshPosts}
          scrollEventThrottle={16}
          onScroll={(e) => {
            const isScrollUp =
              Platform.OS === "ios"
                ? e.nativeEvent.contentOffset.y - lastContentOffset > 0
                : (e.nativeEvent.velocity?.y as number) > 0;
            const canHide =
              e.nativeEvent.contentSize.height > e.nativeEvent.layoutMeasurement.height;

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
            if (Platform.OS === "ios") {
              setLastContentOffset(e.nativeEvent.contentOffset.y);
            }
          }}
          renderItem={renderItemMemoized}
          onEndReached={() => loadMoreData(false)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            renderFooter({
              loading: isLoading,
              hasNoMore,
              loadMore: loadMoreData.bind(null, true),
            })
          }
          viewabilityConfig={viewConfigRef.current}
          onViewableItemsChanged={onViewRef.current}
          onScrollToIndexFailed={({ highestMeasuredFrameIndex }) => {
            listRef.current?.scrollToIndex({ animated: false, index: highestMeasuredFrameIndex });
            if (filteredPosts.length) {
              setTimeout(scrollToLastPosition, 300);
            }
          }}
          keyExtractor={keyExtractor}
        />

        <Footer
          id={route.params.id}
          mainPost={mainPost}
          visible={isShowFooter}
          disabled={isLoading || isRefreshing}
          openPageModal={() => setShowPageModal(true)}
        />

        <PageModal
          index={currentPage}
          total={mainPost?.reply_count}
          loadData={loadData}
          visible={showPageModal}
          onClose={() => setShowPageModal(false)}
        />
        <ActionModal
          visible={showActionModal}
          onClose={() => setShowActionModal(false)}
          item={focusItem}
          postId={mainPost.id}
          forumId={mainPost.forum}
        />
        <CheckUpdate id={mainPost.id} count={mainPost.reply_count} onUpdate={onUpdate} />
      </View>
    </MainPostContext.Provider>
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
