import { useAtom } from "jotai";
import { useReducerAtom } from "jotai/utils";
import { useState, useEffect, useCallback, useMemo, useReducer } from "react";
import Toast from "react-native-toast-message";
import { useIsMounted } from "usehooks-ts";

import usePostFiltered from "./usePostFiltered";

import { Reply, getPostById, Post } from "@/api";
import { historyAtom, orderAtom } from "@/atoms/index";
import Errors from "@/constants/Errors";
import Request from "@/constants/Request";
import { UserHistory } from "@/screens/BrowseHistoryScreen";
import { excludeSameId } from "@/utils/helper";

interface ReplyWithPage extends Reply {
  currentPage?: number;
}

interface PostCache {
  firstPage: number;
  lastPage: number;
  mainPost: Post;
  data: ReplyWithPage[];
}

interface Pagination {
  firstPage: number;
  lastPage: number;
  hasNoMore: boolean;
}

type HistoryAction = {
  type: "REFRESH" | "ADD";
  payload: {
    id: number;
    data: UserHistory;
  };
};

type PaginationAction = {
  type: "PREV" | "NEXT" | "JUMP" | "SET" | "FINISH";
  payload?: {
    nextPage: number;
    length?: number;
  };
};

const historyReducer = (state: UserHistory[], action: HistoryAction) => {
  switch (action.type) {
    case "REFRESH":
      return [
        action.payload.data,
        ...state.filter((record) => record.id && record.id !== action.payload.id),
      ];
    case "ADD":
      return [action.payload.data, ...state];
    default:
      return state;
  }
};

const paginationReducer = (state: Pagination, action: PaginationAction) => {
  switch (action.type) {
    case "PREV":
      return {
        ...state,
        firstPage: action.payload?.nextPage!,
      };
    case "NEXT":
      return {
        ...state,
        lastPage: action.payload?.nextPage!,
        hasNoMore: Number(action.payload?.length) < Request.pageSize,
      };
    case "JUMP":
      return {
        ...state,
        currentPage: action.payload?.nextPage!,
        firstPage: action.payload?.nextPage!,
        lastPage: action.payload?.nextPage!,
      };
    case "FINISH":
      return {
        ...state,
        hasNoMore: true,
      };
    default:
      return state;
  }
};

export default function usePosts(id: number) {
  const [posts, setPosts] = useState<ReplyWithPage[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ReplyWithPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [mainPost, setMainPost] = useState<Post>({} as Post);
  const [lastPosition, setLastPosition] = useState(0);

  const [pagination, dispatchPagination] = useReducer(paginationReducer, {
    firstPage: 1,
    lastPage: 1,
    hasNoMore: false,
  });
  const [history, dispatchHistory] = useReducerAtom<UserHistory[], HistoryAction>(
    historyAtom,
    historyReducer
  );
  const [order] = useAtom(orderAtom);

  const currentHistory = useMemo(() => history?.find((x) => x.id === id), [history, id]);

  const isMounted = useIsMounted();
  const { result: postFiltered, setCurrentId } = usePostFiltered(Number(id));

  const loadData = useCallback(
    async (nextPage: number, jump: boolean = false, updatePosition: boolean = false) => {
      if (!isMounted()) return;
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
          dispatchPagination({ type: "FINISH" });
          if (code !== 6202) {
            Toast.show({
              type: "error",
              text1: Errors[code],
            });
          }
          return;
        }

        const nextPosts: ReplyWithPage[] = reply.map((x) => ({ ...x, currentPage: nextPage }));

        if (!jump) {
          const isPrev =
            nextPage < pagination.firstPage || (nextPage === pagination.firstPage && order === 1);
          if (isPrev) {
            dispatchPagination({
              type: "PREV",
              payload: {
                nextPage,
                length: reply.length,
              },
            });
            setPosts((posts) => [...excludeSameId(nextPosts, posts), ...posts]);
          } else {
            dispatchPagination({
              type: "NEXT",
              payload: {
                nextPage,
                length: reply.length,
              },
            });
            setPosts((posts) => [...posts, ...excludeSameId(nextPosts, posts)]);
          }
        } else {
          dispatchPagination({
            type: "JUMP",
            payload: {
              nextPage,
              length: reply.length,
            },
          });
          setCurrentPage(nextPage);
          setPosts(nextPosts);
        }
        if (updatePosition) {
          setLastPosition(nextPosts[0].id);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [id, isMounted, order, pagination.firstPage]
  );

  // 添加历史记录
  const addToHistory = (noPositionChange: boolean = false) => {
    if (!mainPost?.id) return;
    const actionType = currentHistory ? "REFRESH" : "ADD";
    if (noPositionChange) {
      dispatchHistory({
        type: actionType,
        payload: {
          id: mainPost.id,
          data: {
            ...mainPost,
            createTime: Date.now(),
            currentPage: currentHistory?.currentPage || currentPage,
            position: currentHistory?.position || lastPosition,
          },
        },
      });
    } else {
      dispatchHistory({
        type: actionType,
        payload: {
          id: mainPost.id,
          data: {
            ...mainPost,
            createTime: Date.now(),
            currentPage,
            position: lastPosition,
          },
        },
      });
    }
  };

  const refreshPosts = useCallback(async () => {
    if (pagination.firstPage === 1) {
      setIsRefreshing(true);
      await loadData(1);
      setIsRefreshing(false);
    } else {
      await loadData(pagination.firstPage - 1);
    }
    addToHistory(true);
  }, [pagination.firstPage, order, loadData]);

  const loadMoreData = async (force = false) => {
    if (isLoading || (pagination.hasNoMore && !force)) return;
    if (pagination.hasNoMore) {
      await loadData(pagination.lastPage);
    } else {
      await loadData(pagination.lastPage + 1);
    }
    addToHistory(true);
  };

  useEffect(() => {
    if (!history) return;
    if (currentPage === 0) {
      setCurrentPage(currentHistory?.currentPage || 1);
    }
    if (posts.length === 0) {
      // 初始化
      loadData(currentHistory?.currentPage || 1, true);
    }
  }, [history]);

  // 更新历史记录
  useEffect(() => {
    const shouldUpdate =
      currentHistory?.currentPage !== currentPage || currentHistory?.position !== lastPosition;
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
    posts,
    filteredPosts,
    isLoading,
    isRefreshing,
    hasNoMore: pagination.hasNoMore,
    firstPage: pagination.firstPage,
    lastPage: pagination.lastPage,
    currentPage,
    lastPosition,
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
