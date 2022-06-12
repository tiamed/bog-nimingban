import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { StyleSheet, FlatList, FlatListProps } from "react-native";

import renderFooter from "../HomeScreen/renderFooter";
import FavoriteFloatingAction from "./FavoriteFloatingAction";

import { ThreadPostConfigContext } from "@/Provider";
import { Post } from "@/api";
import {
  clickableAtom,
  expandableAtom,
  favoriteAtom,
  favoriteFilterAtom,
  favoriteTagsAtom,
  maxLineAtom,
} from "@/atoms";
import ThreadPost from "@/components/Post/ThreadPost";
import TagModal, { Tag } from "@/components/TagModal";
import { View } from "@/components/Themed";
import { RootTabScreenProps } from "@/types";
export interface UserFavorite extends Post {
  createTime: number;
  tags: string[];
  lastUpdate?: number;
  newReplyCount?: number;
}

export default function FavoriteScreen({ route, navigation }: RootTabScreenProps<"Favorite">) {
  const [showTagModal, setShowTagModal] = useState(false);
  const [currentFavorite, setCurrentFavorite] = useState<UserFavorite>();
  const [favorite, setFavorite] = useAtom<UserFavorite[], UserFavorite[], void>(favoriteAtom);
  const [favoriteTags] = useAtom(favoriteTagsAtom);
  const [filteredFavorite, setFilteredFavorite] = useState<UserFavorite[]>([]);
  const [maxLine] = useAtom(maxLineAtom);
  const [expandable] = useAtom(expandableAtom);
  const [clickable] = useAtom(clickableAtom);
  const [favoriteFilter] = useAtom(favoriteFilterAtom);
  const renderItem: FlatListProps<UserFavorite>["renderItem"] = ({ item }) =>
    item && (
      <ThreadPost
        key={(item as unknown as Post).id}
        data={item as unknown as Post}
        newCount={item.newReplyCount ? item.newReplyCount - item.reply_count : undefined}
        maxLine={maxLine}
        onLongPress={() => {
          setCurrentFavorite(item);
          setShowTagModal(true);
        }}
      />
    );

  const keyExtractor = (item: Post) => item.id?.toString();

  const getFavoriteName = (id: string) => {
    if (!id) return "";
    if (id === "empty") return "默认";
    return favoriteTags?.find((tag: Tag) => tag.id === favoriteFilter)?.name;
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
    }
  };

  useEffect(() => {
    if (favorite?.length) {
      switch (favoriteFilter) {
        case "empty":
          setFilteredFavorite(favorite.filter((item) => !item?.tags?.length));
          break;
        case "":
          setFilteredFavorite(favorite);
          break;
        default:
          setFilteredFavorite(favorite?.filter((item) => item?.tags?.includes(favoriteFilter)));
          break;
      }
    }
  }, [favorite, favoriteFilter]);

  useEffect(() => {
    const favoriteName = getFavoriteName(favoriteFilter);
    navigation.setOptions({
      title: `收藏·${favoriteName || "全部"} (${filteredFavorite.length})`,
    });
  }, [filteredFavorite]);

  return (
    <ThreadPostConfigContext.Provider value={{ expandable, clickable }}>
      <View style={styles.container}>
        <FlatList
          data={filteredFavorite}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            renderFooter({
              loading: false,
              hasNoMore: true,
            })
          }
        />
        <FavoriteFloatingAction />
        <TagModal
          visible={showTagModal}
          initialValue={currentFavorite?.tags || []}
          onValueChange={onTagsChange}
          onOpen={() => {
            setShowTagModal(true);
          }}
          onDismiss={() => setShowTagModal(false)}
        />
      </View>
    </ThreadPostConfigContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
