import { useAtom } from "jotai";
import { useContext, useState } from "react";
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

export default function EmoticonPicker(props: {
  visible: boolean;
  onInsert: (emoticon: string) => void;
}) {
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

  return (
    <View
      style={{
        width: "100%",
        height: props.visible ? emoticonPickerHeight : 0,
      }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={({ route }) => {
          switch (route.key) {
            case "kaomoji":
              return <EmoticonView data={emoticons?.[0]?.value || []} onInsert={props.onInsert} />;
            case "bmoji":
              return <EmoticonView data={emoticons?.[1]?.value || []} onInsert={props.onInsert} />;
            case "emoji":
              return <EmoticonView data={emoticons?.[2]?.value || []} onInsert={props.onInsert} />;
            case "extra":
              return <EmoticonView data={EXTRA_SYMBOLS} onInsert={props.onInsert} />;
            default:
              return null;
          }
        }}
        onIndexChange={setIndex}
        keyboardDismissMode="none"
        renderTabBar={renderTabBar}
      />
    </View>
  );
}

function EmoticonView(props: { data: string[]; onInsert: (emoticon: string) => void }) {
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
      maxToRenderPerBatch={100}
      keyboardDismissMode="none"
      keyboardShouldPersistTaps="always"
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            props.onInsert(item);
          }}
          style={styles.item}>
          <Text>{item}</Text>
        </TouchableOpacity>
      )}
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
