import { useKeyboard } from "@react-native-community/hooks";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, FlatList } from "react-native";

import { Text } from "@/components/Themed";
import useEmoticons from "@/hooks/useEmoticons";

export default function EmoticonPicker(props: {
  visible: boolean;
  onInsert: (emoticon: string) => void;
}) {
  const emoticons = useEmoticons();
  const [data, setData] = useState<string[]>([]);
  const keyboard = useKeyboard();

  useEffect(() => {
    if (emoticons?.length) {
      setData(emoticons?.map((x) => x?.value)?.flat());
    }
  }, [emoticons]);
  return (
    <FlatList
      style={{
        height: keyboard.keyboardHeight || 200,
        display: props.visible ? "flex" : "none",
        ...styles.list,
      }}
      contentContainerStyle={styles.contentContainer}
      columnWrapperStyle={styles.columnWrapper}
      numColumns={3}
      data={data}
      keyExtractor={(item) => item}
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
    flex: 1,
  },
  contentContainer: {
    height: "auto",
  },
  columnWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    width: "33%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 1,
  },
});
