import { useFocusEffect } from "@react-navigation/native";
import { useAtom, useSetAtom } from "jotai";
import { useState, useEffect, useMemo, createContext, useRef } from "react";
import { StyleSheet, FlatList, Platform, FlatListProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebouncedCallback } from "use-debounce";

import ActionModal from "./ActionModal";
import CheckUpdate from "./CheckUpdate";
import Footer from "./Footer";
import PageModal from "./PageModal";

import { Reply, Post } from "@/api";
import {
  previewsAtom,
  draftAtom,
  postIdRefreshingAtom,
  orderAtom,
  selectionAtom,
} from "@/atoms/index";
import { getImageUrl, getThumbnailUrl } from "@/components/Post/ImageView";
import ReplyPost from "@/components/Post/ReplyPost";
import { View } from "@/components/Themed";
import { useForumsIdMap } from "@/hooks/useForums";
import usePosts from "@/hooks/usePosts";
import renderFooter from "@/screens/HomeScreen/renderFooter";
import { RootStackScreenProps } from "@/types";

export const MainPostContext = createContext({} as Post);
export const RepliesMapContext = createContext(new Map());

interface ReplyWithPage extends Reply {
  currentPage?: number;
}

export default function PostScreen({ route, navigation }: RootStackScreenProps<"Post">) {
  const insets = useSafeAreaInsets();
  const [focusItem, setFocusItem] = useState({} as Reply);
  const [isShowFooter, setIsShowFooter] = useState(true);
  const [lastContentOffset, setLastContentOffset] = useState(0);
  const [maxToRenderPerBatch, setMaxToRenderPerBatch] = useState(10);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showPageModal, setShowPageModal] = useState(false);

  const [postIdRefreshing, setPostIdRefreshing] = useAtom(postIdRefreshingAtom);
  const setPreviews = useSetAtom(previewsAtom);
  const [order] = useAtom(orderAtom);

  const setDraft = useSetAtom(draftAtom);
  const setSelection = useSetAtom(selectionAtom);
  const forumsIdMap = useForumsIdMap();

  const listRef = useRef<FlatList>(null);

  const {
    mainPost,
    posts,
    filteredPosts,
    isLoading,
    isRefreshing,
    hasNoMore,
    firstPage,
    lastPage,
    lastPosition,
    currentPage,
    currentHistory,
    loadData,
    refreshPosts,
    loadMoreData,
    addToHistory,
    setCurrentPage,
    setCurrentId,
    setMainPost,
    setLastPosition,
  } = usePosts(Number(route.params.id));

  const debouncedRefreshPosts = useDebouncedCallback(refreshPosts, 1000, {
    leading: true,
    trailing: false,
  });

  const images = useMemo(() => {
    const replyImages = filteredPosts.map((x) => x.images || []).flat();
    if (firstPage === 1) {
      return [...(mainPost?.images || []), ...replyImages];
    }
    return replyImages;
  }, [filteredPosts]);

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

  const scrollToLastPosition = () => {
    if (listRef.current && currentHistory?.position && filteredPosts.length && !lastPosition) {
      const index = filteredPosts.findIndex((post) => post.id === currentHistory.position);
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
      withPadding
    />
  );

  const renderItemMemoized = useMemo(() => renderItem, [filteredPosts]);

  const renderMainPostMemoized = useMemo(
    () => (firstPage === 1 && mainPost.id ? renderItem({ item: mainPost }) : null),
    [mainPost, firstPage]
  );

  const keyExtractor = (item: any) => item.id.toString();

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
        title: `Po.${mainPost.id},${forumsIdMap.get(mainPost.forum)}·${mainPost.reply_count}`,
      });
      addToHistory(true);
    }
  }, [mainPost]);

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
    if (!(isLoading || isRefreshing) && filteredPosts.length) {
      scrollToLastPosition();
    }
  }, [filteredPosts, isLoading, isRefreshing]);

  useEffect(() => {
    if (filteredPosts?.some((post) => post.content.length > 5000)) {
      setMaxToRenderPerBatch(1);
    } else {
      setMaxToRenderPerBatch(10);
    }
  }, [filteredPosts]);

  return (
    <MainPostContext.Provider value={mainPost}>
      <RepliesMapContext.Provider value={new Map(posts.map((post) => [post.id, post]))}>
        <View style={{ ...styles.container, paddingBottom: insets.bottom }}>
          <FlatList
            ref={listRef}
            data={filteredPosts}
            refreshing={isRefreshing}
            onRefresh={debouncedRefreshPosts}
            scrollEventThrottle={16}
            windowSize={21}
            maxToRenderPerBatch={maxToRenderPerBatch}
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
            ListHeaderComponent={renderMainPostMemoized}
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
      </RepliesMapContext.Provider>
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
