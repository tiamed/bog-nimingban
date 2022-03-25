import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Share } from "react-native";
import * as Clipboard from "expo-clipboard";
import Modal from "react-native-modal";
import { decode } from "html-entities";

import { Text, View, useThemeColor, Button } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import { Reply, getPostById, Post } from "../api";
import ReplyPost from "../components/ReplyPost";
import { renderFooter } from "./HomeScreen";
import TabBarIcon from "../components/TabBarIcon";
import {
  historyAtom,
  previewsAtom,
  favoriteAtom,
  draftAtom,
} from "../atoms/index";
import { atom, useAtom, useSetAtom } from "jotai";
import { getImageUrl, getThumbnailUrl } from "../components/ThreadPost";
import { UserHistory } from "./HistoryScreen";
import { UserFavorite } from "./FavoriteScreen";
import Toast from "react-native-root-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useForumsIdMap } from "../hooks/useForums";

const showPageModalAtom = atom(false);
const showActionModalAtom = atom(false);

export default function PostScreen({
  route,
  navigation,
}: RootStackScreenProps<"Post">) {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<Reply[]>([]);
  const [mainPost, setMainPost] = useState<Post>({} as Post);
  const [currentPage, setCurrentPage] = useState(0);
  const [firstPage, setFirstPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNoMore, setHasNoMore] = useState(false);
  const [lastPageFinished, setLastPageFinished] = useState(false);

  const [focusItem, setFocusItem] = useState({} as Reply);
  const setPreviews = useSetAtom(previewsAtom);
  const [history, setHistory] = useAtom<UserHistory[], UserHistory[], void>(
    historyAtom
  );

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
      } = await getPostById(route.params.id as number, nextPage);

      if (rest.id) {
        setMainPost(rest as Post);
      }

      if (type === "error") {
        setHasNoMore(true);
        return;
      }

      let nextPosts = nextPage === 1 ? [rest, ...reply] : [...reply];
      if (!jump) {
        nextPosts = nextPosts.filter(
          (post) => !posts.find((x) => x.id === post.id)
        );
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
  }, [firstPage]);

  const loadMoreData = async (force = false) => {
    if (isLoading || (hasNoMore && !force)) return;
    if (hasNoMore && !lastPageFinished) {
      loadData(lastPage);
    } else {
      loadData(lastPage + 1);
    }
  };

  // 添加历史记录
  const addToHistory = () => {
    let newHistory = history.filter((x) => x.id) || [];
    if (
      history?.find((record: { id: number }) => record.id === route.params.id)
    ) {
      newHistory = history.filter((record) => record.id !== route.params.id);
    }
    newHistory.unshift({
      ...mainPost,
      createTime: Date.now(),
      currentPage: currentPage,
    });
    setHistory(newHistory);
  };

  useEffect(() => {
    navigation.setOptions({
      title: route.params.title,
    });
  }, []);

  useEffect(() => {
    if (history) {
      const current = history?.find((x) => x.id === route.params.id);
      setCurrentPage(current?.currentPage || 1);
      if (posts.length === 0) {
        loadData(current?.currentPage || 1, true);
      }
    }
  }, [history]);

  useEffect(() => {
    if (images.length) {
      setPreviews(
        images.map((item) => ({
          url: getImageUrl(item),
          originalUrl: getThumbnailUrl(item),
        }))
      );
    }
  }, [images]);

  useEffect(() => {
    if (mainPost.id === route.params.id && currentPage !== 0) {
      addToHistory();
      navigation.setOptions({
        title: `${forumsIdMap.get(mainPost.forum)} Po.${mainPost.id}`,
      });
    }
  }, [mainPost, currentPage]);

  useEffect(() => {
    setCurrentPage(firstPage);
  }, [firstPage]);

  useEffect(() => {
    setCurrentPage(lastPage);
  }, [lastPage]);

  useEffect(() => {
    setDraft("");
  }, [route.params.id]);

  return (
    <View style={{ ...styles.container, paddingBottom: insets.bottom }}>
      <FlatList
        data={posts}
        refreshing={isRefreshing}
        onRefresh={refreshPosts}
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
        onEndReached={loadMoreData.bind(null, false)}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter.bind(
          null,
          isLoading,
          hasNoMore,
          loadMoreData.bind(null, true)
        )}
      ></FlatList>

      <Footer id={route.params.id} mainPost={mainPost}></Footer>

      <PageModal
        index={currentPage}
        total={mainPost?.reply_count}
        loadData={loadData}
      ></PageModal>
      <ActionModal
        item={focusItem}
        postId={mainPost.id}
        forumId={mainPost.forum}
      ></ActionModal>
    </View>
  );
}

function Footer(props: { id: number; mainPost: Post }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorite, setFavorite] = useAtom<UserFavorite[], UserFavorite[], void>(
    favoriteAtom
  );
  const setShowPageModal = useSetAtom(showPageModalAtom);
  const tintColor = useThemeColor({}, "tint");
  const navigation = useNavigation();

  // 添加/取消收藏
  const toggleFavorite = () => {
    let newFavorite = favorite.filter((x) => x.id) || [];
    if (favorite?.find((record: { id: number }) => record.id === props.id)) {
      newFavorite = favorite.filter((record) => record.id !== props.id);
    }
    if (!isFavorite) {
      newFavorite.unshift({
        ...props.mainPost,
        createTime: Date.now(),
      });
    }
    setFavorite(newFavorite);
  };

  useEffect(() => {
    setIsFavorite(Boolean(favorite.find((x) => x.id === props.mainPost?.id)));
  }, [favorite, props.mainPost]);

  return (
    <View
      style={{
        ...styles.footer,
        borderTopColor: tintColor,
      }}
    >
      <TouchableOpacity onPress={toggleFavorite}>
        <View style={styles.footerItem}>
          <TabBarIcon
            name={isFavorite ? "heart" : "heart-o"}
            color={tintColor}
          />
          <Text
            lightColor={tintColor}
            darkColor={tintColor}
            style={styles.footerItemText}
          >
            收藏
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onShare.bind(null, props.id, props.mainPost?.content)}
      >
        <View style={styles.footerItem}>
          <TabBarIcon name="share" color={tintColor} />
          <Text
            lightColor={tintColor}
            darkColor={tintColor}
            style={styles.footerItemText}
          >
            分享
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ReplyModal", {
            postId: props.id,
            forumId: props.mainPost.forum,
          });
        }}
      >
        <View style={styles.footerItem}>
          <TabBarIcon name="edit" color={tintColor} />
          <Text
            lightColor={tintColor}
            darkColor={tintColor}
            style={styles.footerItemText}
          >
            回复
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setShowPageModal(true);
        }}
      >
        <View style={styles.footerItem}>
          <TabBarIcon name="bookmark" color={tintColor} />
          <Text
            lightColor={tintColor}
            darkColor={tintColor}
            style={styles.footerItemText}
          >
            跳页
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function onShare(id: number, content: string) {
  Share.share({
    message: `${content
      .replace(/<[^>]+>/g, "")
      .slice(0, 100)} http://bog.ac/t/${id}/

来自B岛匿名版`,
  });
}

function PageModal(props: {
  index: number;
  total: number;
  loadData: (page: number, jump: boolean) => void;
}) {
  const { index, total } = props;
  const [visible, setVisible] = useAtom(showPageModalAtom);
  const [input, setInput] = useState("1");
  useEffect(() => {
    setInput(`${index}`);
  }, [index]);
  const close = () => {
    setVisible(false);
  };
  const confirm = () => {
    if (input) {
      const page = parseInt(input);
      if (Number.isInteger(page) && page > 0 && page <= total) {
        props.loadData(page, true);
      }
    }
    setVisible(false);
  };
  return (
    <Modal isVisible={visible} onBackdropPress={close}>
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>跳页</Text>
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={() => {
              setInput("1");
            }}
          >
            <TabBarIcon
              color={useThemeColor({}, "tint")}
              name="backward"
            ></TabBarIcon>
          </TouchableOpacity>
          <View style={styles.modalInputWrapper}>
            <TextInput
              style={styles.modalInput}
              onChangeText={(val) => setInput(val)}
              value={input}
            />
            <Text>/{Math.ceil(total / 20)}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setInput(`${Math.ceil(total / 20)}`);
            }}
          >
            <TabBarIcon
              color={useThemeColor({}, "tint")}
              name="forward"
            ></TabBarIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.modalFooter}>
          <View style={styles.modalFooterButton}>
            <Button title="取消" onPress={close}></Button>
          </View>
          <View style={styles.modalFooterButton}>
            <Button title="确定" onPress={confirm}></Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ActionModal(props: { item: Reply; postId: number; forumId: number }) {
  const [visible, setVisible] = useAtom(showActionModalAtom);
  const navigation = useNavigation();
  const close = () => {
    setVisible(false);
  };
  const onReply = () => {
    close();
    navigation.navigate("ReplyModal", {
      postId: props.postId,
      content: `>>Po.${props.item.id}\n`,
      forumId: props.forumId,
    });
  };
  const onCopy = () => {
    Clipboard.setString(decode(props.item.content)?.replace(/<[^>]*>/g, ""));
    close();
    Toast.show("已复制到剪贴板");
  };

  return (
    <Modal isVisible={visible} onBackdropPress={close} backdropOpacity={0.3}>
      <View style={styles.actionModal}>
        <TouchableOpacity onPress={onReply}>
          <View style={styles.actionModalItem}>
            <Text>回复</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCopy}>
          <View style={styles.actionModalItem}>
            <Text>复制</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
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
  footer: {
    width: "100%",
    height: 50,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerItemText: {
    marginLeft: 10,
  },
  modal: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 20,
    padding: 10,
  },
  modalContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modalFooter: {
    padding: 20,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  modalFooterButton: {
    marginLeft: 20,
  },
  modalInput: {
    backgroundColor: "#eee",
    width: 50,
    textAlign: "center",
  },
  modalInputWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  actionModal: {
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "flex-start",
    borderRadius: 10,
    overflow: "hidden",
    width: 300,
    padding: 6,
  },
  actionModalItem: {
    padding: 10,
    marginLeft: 20,
    width: 260,
  },
});
