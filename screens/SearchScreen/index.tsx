import { useReducerAtom } from "jotai/utils";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  InteractionManager,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SearchHistory, { searchHistoryReducer } from "./SearchHistory";

import { searchHistoryAtom } from "@/atoms";
import Icon from "@/components/Icon";
import Overlay from "@/components/Overlay";
import { Button, View, TextInput, useThemeColor, Text } from "@/components/Themed";
import Layout from "@/constants/Layout";
import { RootStackScreenProps } from "@/types";

export default function SearchScreen({ route, navigation }: RootStackScreenProps<"Search">) {
  const overlayColor = useThemeColor({}, "replyBackground");
  const inactiveColor = useThemeColor({}, "inactive");
  const tintColor = useThemeColor({}, "tint");
  const insets = useSafeAreaInsets();
  const [, dispatchSearchHistory] = useReducerAtom(searchHistoryAtom, searchHistoryReducer);
  const inputRef = useRef<any>(null);

  const [query, setQuery] = useState("");

  const jump = () => {
    if (!query) return;
    dispatchSearchHistory({
      type: "ADD",
      payload: { query, isJump: true },
    });
    navigation.navigate("Post", {
      id: Number(query),
      title: `Po.${query}`,
    });
  };

  const search = () => {
    if (!query) return;
    dispatchSearchHistory({
      type: "ADD",
      payload: { query, isJump: false },
    });
    navigation.navigate("SearchResult", { query });
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      inputRef.current?.focus();
    });
  });

  return (
    <View style={[styles.modal, { paddingBottom: insets.bottom }]}>
      <Overlay style={{ backgroundColor: overlayColor }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}>
        <SearchHistory />
        <View style={styles.bottom}>
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={(val) => setQuery(val)}
            placeholder="输入搜索内容或串号"
            style={[
              styles.input,
              {
                borderColor: tintColor,
              },
            ]}
          />
          <View style={styles.bottomGroup}>
            <Button
              title="取消"
              color={inactiveColor}
              onPress={() => {
                navigation.goBack();
              }}
            />
            <View style={styles.buttons}>
              <Button title="跳转串号" onPress={jump} />
              <TouchableOpacity
                onPress={search}
                style={[styles.searchIcon, { backgroundColor: tintColor }]}>
                <Icon family="Octicons" name="search" color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 0,
    alignItems: "center",
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
  },
  bottom: {
    padding: Layout.padding,
    paddingTop: 20,
    flexDirection: "column",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "transparent",
    padding: 12,
  },
  bottomGroup: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    paddingHorizontal: 19,
    paddingVertical: 8,
    borderRadius: 60,
    marginLeft: 12,
  },
});
