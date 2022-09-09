import { useNavigation } from "@react-navigation/native";
import { atom, useAtom } from "jotai";
import { useReducerAtom } from "jotai/utils";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { useThemeColor } from "../../components/Themed";

import { searchHistoryAtom } from "@/atoms";
import Icon from "@/components/Icon";
import { Text } from "@/components/Themed";
import Layout from "@/constants/Layout";

interface SearchHistoryItem {
  isJump: boolean;
  query: string;
}

interface SearchHistoryReducerAction {
  type: "ADD" | "DELETE" | "CLEAR";
  payload?: SearchHistoryItem;
}

const canDeleteAtom = atom(false);

export const searchHistoryReducer = (
  state: SearchHistoryItem[],
  action: SearchHistoryReducerAction
) => {
  switch (action.type) {
    case "ADD":
      return [
        action.payload!,
        ...state.filter(
          (x) => !(x.query === action.payload!.query && x.isJump === action.payload!.isJump)
        ),
      ];
    case "DELETE":
      return state.filter(
        (x) => !(x.query === action.payload!.query && x.isJump === action.payload!.isJump)
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
};

function HistoryItem(props: { item: SearchHistoryItem }) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const [searchHistory, dispatchSearchHistory] = useReducerAtom(
    searchHistoryAtom,
    searchHistoryReducer
  );
  const navigation = useNavigation();

  const [canDelete, setCanDelete] = useAtom(canDeleteAtom);

  return (
    <>
      <TouchableOpacity
        key={`${props.item.query}-${props.item.isJump}`}
        style={[styles.item, { backgroundColor }]}
        onLongPress={() => {
          setCanDelete(!canDelete);
        }}
        onPress={() => {
          if (canDelete) {
            dispatchSearchHistory({
              type: "DELETE",
              payload: props.item,
            });
          } else {
            dispatchSearchHistory({
              type: "ADD",
              payload: props.item,
            });
            if (props.item.isJump) {
              navigation.navigate("Post", {
                id: Number(props.item.query),
                title: `Po.${props.item.query}`,
              });
            } else {
              navigation.navigate("SearchResult", {
                query: props.item.query,
              });
            }
          }
        }}>
        {props.item.isJump && (
          <Icon style={{ marginRight: 4 }} family="Octicons" name="arrow-right" color={textColor} />
        )}
        <Text>{props.item.query}</Text>
        {canDelete && (
          <Icon style={{ marginLeft: 4 }} family="Octicons" name="x" color={textColor} />
        )}
      </TouchableOpacity>
    </>
  );
}

export default function SearchHistory() {
  const [searchHistory, dispatchSearchHistory] = useReducerAtom(
    searchHistoryAtom,
    searchHistoryReducer
  );
  const inactiveColor = useThemeColor({}, "inactive");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ color: inactiveColor }}>搜索记录</Text>
        <TouchableOpacity
          onPress={() => {
            dispatchSearchHistory({
              type: "CLEAR",
            });
          }}>
          <Icon family="Octicons" name="trash" color={inactiveColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.items}>
        {searchHistory.map((item: SearchHistoryItem) => (
          <HistoryItem item={item} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.padding,
    flexDirection: "column",
  },
  header: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  items: {
    flexDirection: "row",
    flexWrap: "wrap-reverse",
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 32,
    marginRight: 8,
    flexDirection: "row",
  },
  popover: {
    padding: 12,
    borderRadius: 6,
  },
});
