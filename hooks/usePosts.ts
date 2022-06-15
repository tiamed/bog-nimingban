import { useAtom } from "jotai";
import { useState, useEffect, useCallback } from "react";
import Toast from "react-native-toast-message";
import { useIsMounted } from "usehooks-ts";

import usePostFiltered from "./usePostFiltered";

import { Reply, getPostById, Post } from "@/api";
import { historyAtom, orderAtom } from "@/atoms/index";
import Errors from "@/constants/Errors";
import { UserHistory } from "@/screens/BrowseHistoryScreen";

interface ReplyWithPage extends Reply {
  currentPage?: number;
}

interface PostCache {
  firstPage: number;
  lastPage: number;
  mainPost: Post;
  data: ReplyWithPage[];
}

export default function usePosts(id: number) {
  const [posts, setPosts] = useState<ReplyWithPage[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ReplyWithPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [firstPage, setFirstPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNoMore, setHasNoMore] = useState(false);
  const [lastPageFinished, setLastPageFinished] = useState(false);

  const [mainPost, setMainPost] = useState<Post>({} as Post);
  const [lastPosition, setLastPosition] = useState(0);
  const [currentHistory, setCurrentHistory] = useState({} as UserHistory);

  const [history, setHistory] = useAtom<UserHistory[], UserHistory[], void>(historyAtom);
  const [order] = useAtom(orderAtom);

  const isMounted = useIsMounted();
  const { result: postFiltered, setCurrentId } = usePostFiltered(Number(id));

  const loadData = useCallback(
    async (nextPage: number, jump: boolean = false, updatePosition: boolean = false) => {
      if (!isMounted) return;
      try {
        setIsLoading(true);
        const {
          data: {
            type,
            code,
            info: { reply, ...rest },
          },
        } = await getPostById(id as number, nextPage, 20, order);

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

        let nextPosts = replyWithPage;
        if (!jump) {
          nextPosts = nextPosts.filter((post) => !posts.find((x) => x.id === post.id));
        }

        if (jump) {
          setFirstPage(nextPage);
          setLastPage(nextPage);
          setCurrentPage(nextPage);
          setHasNoMore(reply?.length !== 20);
          setLastPageFinished(reply?.length === 20);
          setPosts(nextPosts);
        } else {
          if (nextPage < firstPage || (nextPage === firstPage && order === 1)) {
            setFirstPage(nextPage);
            setPosts([...nextPosts, ...posts]);
          } else {
            setLastPage(nextPage);
            setHasNoMore(reply?.length !== 20);
            setLastPageFinished(reply?.length === 20);
            setPosts([...posts, ...nextPosts]);
          }
        }
        if (updatePosition) {
          setLastPosition(nextPosts[0].id);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [posts, order, id]
  );

  const refreshPosts = useCallback(async () => {
    if (firstPage === 1) {
      setIsRefreshing(true);
      await loadData(1);
      setIsRefreshing(false);
    } else {
      await loadData(firstPage - 1);
    }
    addToHistory(true);
  }, [firstPage, order, loadData]);

  const loadMoreData = async (force = false) => {
    if (isLoading || (hasNoMore && !force)) return;
    if (hasNoMore && !lastPageFinished) {
      await loadData(lastPage);
    } else {
      await loadData(lastPage + 1);
    }
    addToHistory(true);
  };

  // 添加历史记录
  const addToHistory = (noPositionChange: boolean = false) => {
    if (!mainPost?.id) return;
    let newHistory = history.filter((x) => x.id) || [];
    const oldHistory = currentHistory;
    if (oldHistory) {
      newHistory = history.filter((record) => record.id && record.id !== id);
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

  useEffect(() => {
    if (history) {
      const current = history?.find((x) => x.id === id);
      if (current) {
        setCurrentHistory(current);
      }
      setCurrentPage(current?.currentPage || 1);
      if (posts.length === 0) {
        // 初始化
        loadData(current?.currentPage || 1, true);
      }
    }
  }, [history]);

  // 更新历史记录
  useEffect(() => {
    const shouldUpdate =
      currentHistory.currentPage !== currentPage || currentHistory.position !== lastPosition;
    if (lastPosition && mainPost.id === id && shouldUpdate) {
      addToHistory();
    }
  }, [currentPage, lastPosition, mainPost]);

  useEffect(() => {
    if (postFiltered) {
      setFilteredPosts(posts.filter((post) => post.cookie === mainPost.cookie));
    } else {
      setFilteredPosts(posts);
    }
  }, [posts, postFiltered]);

  useEffect(() => {
    if (!isLoading) {
      setPosts([]);
      loadData(1, true);
    }
  }, [order]);

  return {
    mainPost,
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
  };
}
