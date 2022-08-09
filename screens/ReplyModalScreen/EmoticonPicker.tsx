import { useAtom } from "jotai";
import { memo, useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, FlatList, View } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";

import { LayoutConfigContext } from "@/Provider";
import { emoticonIndexAtom } from "@/atoms";
import { Text, useThemeColor } from "@/components/Themed";
import useEmoticons from "@/hooks/useEmoticons";

const EXTRA_SYMBOLS = [">>Po."];
const ROUTE_CONFIG = [
  { key: "kaomoji", title: "[つд⊂]" },
  { key: "bmoji", title: "(`Д´)" },
  { key: "emoji", title: "🐴" },
  { key: "extra", title: "特殊" },
];

const EmoticonViewMemoized = memo(EmoticonView);

export default function EmoticonPicker(props: { onInsert: (emoticon: string) => void }) {
  const emoticons = useEmoticons();
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  const [index, setIndex] = useAtom(emoticonIndexAtom);
  const [routes] = useState(ROUTE_CONFIG);
  const { emoticonPickerHeight } = useContext(LayoutConfigContext);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      style={{ backgroundColor, elevation: 0 }}
      indicatorStyle={{ backgroundColor: tintColor }}
      pressColor={backgroundColor}
      renderLabel={({ route }) => <Text>{route.title}</Text>}
    />
  );

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case "kaomoji":
        return (
          <EmoticonViewMemoized data={emoticons?.[0]?.value || []} onInsert={props.onInsert} />
        );
      case "bmoji":
        return (
          <EmoticonViewMemoized data={emoticons?.[1]?.value || []} onInsert={props.onInsert} />
        );
      case "emoji":
        return (
          <EmoticonViewMemoized data={emoticons?.[2]?.value || []} onInsert={props.onInsert} />
        );
      case "extra":
        return <EmoticonViewMemoized data={EXTRA_SYMBOLS} onInsert={props.onInsert} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    console.log("onInsert changed");
  }, [props.onInsert]);

  return (
    <View
      style={{
        width: "100%",
        height: emoticonPickerHeight,
      }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        keyboardDismissMode="none"
        renderTabBar={renderTabBar}
        lazy
      />
    </View>
  );
}

function EmoticonView(props: { data: string[]; onInsert: (emoticon: string) => void }) {
  const renderItem = ({ item }: { item: string }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.onInsert(item);
        }}
        style={styles.item}>
        <Text>{item}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      style={{
        height: "100%",
        ...styles.list,
      }}
      contentContainerStyle={styles.contentContainer}
      columnWrapperStyle={styles.columnWrapper}
      numColumns={4}
      data={props.data}
      keyExtractor={(item) => item}
      maxToRenderPerBatch={1}
      keyboardDismissMode="none"
      keyboardShouldPersistTaps="always"
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    overflow: "scroll",
  },
  contentContainer: {
    height: "auto",
  },
  columnWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 0,
    marginTop: 1,
  },
});
