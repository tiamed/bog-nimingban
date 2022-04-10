import { useAtom } from "jotai";
import { StyleSheet, FlatList, FlatListProps } from "react-native";

import renderFooter from "./HomeScreen/renderFooter";

import { Post } from "@/api";
import { favoriteAtom, maxLineAtom } from "@/atoms";
import ThreadPost from "@/components/Post/ThreadPost";
import { View } from "@/components/Themed";
import { RootTabScreenProps } from "@/types";
export interface UserFavorite extends Post {
  createTime: number;
}

export default function FavoriteScreen({ route, navigation }: RootTabScreenProps<"Favorite">) {
  const [favorite] = useAtom<UserFavorite[]>(favoriteAtom);
  const [maxLine] = useAtom(maxLineAtom);
  const renderItem: FlatListProps<UserFavorite>["renderItem"] = ({ item }) =>
    item && (
      <ThreadPost
        key={(item as unknown as Post).id}
        data={item as unknown as Post}
        maxLine={maxLine}
      />
    );

  const keyExtractor = (item: Post) => item.id.toString();

  return (
    <View style={styles.container}>
      <FlatList
        data={favorite}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => renderFooter(false, true)}
      />
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
});
