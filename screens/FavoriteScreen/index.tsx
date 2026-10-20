import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
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
import FilterBar from "@/components/FilterBar";
import ThreadPost from "@/components/Post/ThreadPost";
import TagModal, { Tag } from "@/components/TagModal";
import { View } from "@/components/Themed";
import useListSearch from "@/hooks/useListSearch";
import { RootTabScreenProps } from "@/types";
import { formatSearchLabel } from "@/utils/listSearch";
export interface UserFavorite extends Post {
  createTime: number;
  tags: string[];
  lastUpdate?: number;
  newReplyCount?: number;
}

export default function FavoriteScreen({ route, navigation }: RootTabScreenProps<"Favorite">) {
  const [showTagModal, setShowTagModal] = useState(false);
  const [currentFavorite, setCurrentFavorite] = useState<UserFavorite>();
  const [query, setQuery] = useState("");
  const [favorite, setFavorite] = useAtom<UserFavorite[], UserFavorite[], void>(favoriteAtom);
  const [favoriteTags] = useAtom(favoriteTagsAtom);
  const [maxLine] = useAtom(maxLineAtom);
  const [expandable] = useAtom(expandableAtom);
  const [clickable] = useAtom(clickableAtom);
  const [favoriteFilter] = useAtom(favoriteFilterAtom);
  const taggedFavorite = useMemo(() => {
    const list = favorite ?? [];
    switch (favoriteFilter) {
      case "empty":
        return list.filter((item) => !item?.tags?.length);
      case "":
        return list;
      default:
        return list.filter((item) => item?.tags?.includes(favoriteFilter));
    }
  }, [favorite, favoriteFilter]);
  const { results: filteredFavorite, searching } = useListSearch(taggedFavorite, query);
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
    const favoriteName = getFavoriteName(favoriteFilter);
    navigation.setOptions({
      title: `收藏·${favoriteName || "全部"} (${taggedFavorite.length})`,
    });
  }, [taggedFavorite]);

  return (
    <ThreadPostConfigContext.Provider value={{ expandable, clickable }}>
      <View style={styles.container}>
        {searching && (
          <FilterBar
            label={`${formatSearchLabel(query)} · ${filteredFavorite.length}/${
              taggedFavorite.length
            } 条`}
            onClear={() => setQuery("")}
          />
        )}
        <FlatList
          style={styles.list}
          data={filteredFavorite}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            renderFooter({
              loading: false,
              hasNoMore: true,
              empty: searching && filteredFavorite.length === 0,
              emptyText: "没有匹配的收藏",
            })
          }
        />
        <FavoriteFloatingAction query={query} onQueryChange={setQuery} />
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
  list: {
    width: "100%",
  },
});
