import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useAtom, useSetAtom } from "jotai";
import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, TouchableOpacity, Share } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Post } from "@/api";
import { favoriteAtom, showPageModalAtom } from "@/atoms/index";
import Icon from "@/components/Icon";
import TagModal from "@/components/TagModal";
import { Text, View, useThemeColor } from "@/components/Themed";
import Urls from "@/constants/Urls";
import { UserFavorite } from "@/screens/FavoriteScreen";

export default function Footer(props: {
  id: number;
  mainPost: Post;
  visible: boolean;
  disabled: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [favorite, setFavorite] = useAtom<UserFavorite[], UserFavorite[], void>(favoriteAtom);
  const [currentFavorite, setCurrentFavorite] = useState<UserFavorite>();
  const setShowPageModal = useSetAtom(showPageModalAtom);
  const navigation = useNavigation();
  const tintColor = useThemeColor({}, "tint");
  const height = useSharedValue(50);
  const insets = useSafeAreaInsets();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  // 添加/取消收藏
  const toggleFavorite = () => {
    const newFavorite = favorite?.filter((record) => record?.id && record?.id !== props.id) || [];
    if (!isFavorite) {
      newFavorite.unshift({
        ...props.mainPost,
        createTime: Date.now(),
        tags: [],
      });
    }
    setFavorite(newFavorite);
    return newFavorite;
  };

  const onTagsChange = (tags: string[]) => {
    if (currentFavorite) {
      setFavorite(
        favorite.map((record) => {
          if (record.id === currentFavorite.id) {
            return {
              ...record,
              tags,
            };
          }
          return record;
        })
      );
    } else {
      const newFavorite = favorite?.filter((record) => record?.id && record?.id !== props.id) || [];
      newFavorite.unshift({
        ...props.mainPost,
        createTime: Date.now(),
        tags: [],
      });
      setFavorite(newFavorite);
    }
  };
  const items = [
    {
      label: "收藏",
      icon: isFavorite ? "heart" : "heart-o",
      handler: toggleFavorite,
      longPressHandler: () => {
        setShowTagModal(true);
      },
    },
    {
      label: "分享",
      icon: "share",
      handler: onShare.bind(null, props.id, props.mainPost?.content),
    },
    {
      label: "回复",
      icon: "edit",
      handler: () => {
        navigation.navigate("ReplyModal", {
          postId: props.id,
          forumId: props.mainPost.forum,
        });
      },
    },
    {
      label: "跳页",
      icon: "bookmark",
      handler: () => {
        setShowPageModal(true);
      },
    },
  ];

  const FooterItems = useMemo(() => {
    return items.map((item) => (
      <FooterItem
        key={item.label}
        label={item.label}
        icon={item.icon as React.ComponentProps<typeof FontAwesome>["name"]}
        handler={item.handler}
        longPressHandler={item.longPressHandler}
        disabled={props.disabled}
      />
    ));
  }, [items, props.disabled]);

  useEffect(() => {
    if (props.mainPost?.id && isFavorite) {
      const updatedFavorite = favorite.map((record) => {
        if (record.id === props.mainPost.id) {
          return {
            ...record,
            ...props.mainPost,
          };
        }
        return record;
      });
      setFavorite(updatedFavorite);
    }
  }, [props.mainPost]);

  useEffect(() => {
    const currentFavorite = favorite.find((x) => x.id === props.mainPost?.id);
    setIsFavorite(Boolean(currentFavorite));
    setCurrentFavorite(currentFavorite);
  }, [favorite, props.mainPost]);

  useEffect(() => {
    if (props.visible) {
      height.value = withTiming(50, { duration: 50 });
    } else {
      height.value = withTiming(0, { duration: 50 });
    }
  }, [props.visible]);

  return (
    <>
      <TagModal
        visible={showTagModal}
        initialValue={currentFavorite?.tags || []}
        onValueChange={onTagsChange}
        onOpen={() => {
          setShowTagModal(true);
        }}
        onDismiss={() => setShowTagModal(false)}
      />
      <Animated.View style={[styles.footerWrapper, animatedStyle, { bottom: insets.bottom }]}>
        <View
          style={{
            ...styles.footer,
            borderTopColor: tintColor,
          }}>
          {FooterItems}
        </View>
      </Animated.View>
    </>
  );
}

function FooterItem(props: {
  label: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  handler: () => void;
  longPressHandler?: () => void;
  disabled: boolean;
}) {
  const tintColor = useThemeColor({}, "tint");

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.handler();
      }}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        props.longPressHandler?.();
      }}
      disabled={props.disabled}
      hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}>
      <View style={styles.footerItem}>
        <Icon name={props.icon} color={tintColor} />
        <Text lightColor={tintColor} darkColor={tintColor} style={styles.footerItemText}>
          {props.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function onShare(id: number, content: string) {
  Share.share({
    message: `${content.replace(/<[^>]+>/g, "").slice(0, 100)} ${Urls.baseURL}t/${id}/

来自B岛匿名版 https://github.com/tiamed/bog-nimingban`,
  });
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  footerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
  },
  footer: {
    height: "100%",
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
});
