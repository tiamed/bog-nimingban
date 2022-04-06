import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Share } from "react-native";

import { Text, View, useThemeColor, Button } from "../../components/Themed";
import Icon from "../../components/Icon";
import { favoriteAtom, showPageModalAtom } from "../../atoms/index";
import { useAtom, useSetAtom } from "jotai";
import { UserFavorite } from "../FavoriteScreen";
import { useNavigation } from "@react-navigation/native";
import { Post } from "../../api";
import { FontAwesome } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function Footer(props: {
  id: number;
  mainPost: Post;
  visible: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorite, setFavorite] = useAtom<UserFavorite[], UserFavorite[], void>(
    favoriteAtom
  );
  const setShowPageModal = useSetAtom(showPageModalAtom);
  const navigation = useNavigation();
  const tintColor = useThemeColor({}, "tint");
  const height = useSharedValue(50);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

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

  useEffect(() => {
    if (props.visible) {
      height.value = withTiming(50, { duration: 50 });
    } else {
      height.value = withTiming(0, { duration: 50 });
    }
  }, [props.visible]);

  return (
    <Animated.View style={[styles.footerWrapper, animatedStyle]}>
      <View
        style={{
          ...styles.footer,
          borderTopColor: tintColor,
        }}
      >
        {[
          {
            label: "收藏",
            icon: isFavorite ? "heart" : "heart-o",
            handler: toggleFavorite,
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
        ].map((item) => (
          <FooterItem
            key={item.label}
            label={item.label}
            icon={item.icon as React.ComponentProps<typeof FontAwesome>["name"]}
            handler={item.handler}
          ></FooterItem>
        ))}
      </View>
    </Animated.View>
  );
}

function FooterItem(props: {
  label: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  handler: () => void;
}) {
  const tintColor = useThemeColor({}, "tint");

  return (
    <TouchableOpacity onPress={props.handler}>
      <View style={styles.footerItem}>
        <Icon name={props.icon} color={tintColor} />
        <Text
          lightColor={tintColor}
          darkColor={tintColor}
          style={styles.footerItemText}
        >
          {props.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function onShare(id: number, content: string) {
  Share.share({
    message: `${content
      .replace(/<[^>]+>/g, "")
      .slice(0, 100)} http://bog.ac/t/${id}/

来自B岛匿名版 https://expo.dev/@creasus/bog-nimingban`,
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
