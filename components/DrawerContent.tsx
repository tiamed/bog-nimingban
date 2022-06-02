import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebouncedCallback } from "use-debounce";

import { Octicon } from "./Icon";
import { ScrollView, Text, useThemeColor } from "./Themed";

import { threadAtom } from "@/atoms";
import useForums from "@/hooks/useForums";

export default function DrawerContent(props: any) {
  const forums = useForums();
  const [thread] = useAtom(threadAtom);
  const textColor = useThemeColor({ light: "#404040", dark: "#bfbfbf" }, "text");
  const tintColor = useThemeColor({}, "tint");
  const tintBackgroundColor = useThemeColor({}, "tintBackground");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const onPress = useDebouncedCallback(
    (forum) => {
      if (thread === forum.id) return;
      props.navigation.navigate("HomeMain", {
        thread: forum.id,
      });
    },
    1000,
    {
      leading: true,
      trailing: false,
    }
  );

  return (
    <View style={{ marginTop: insets.top, flex: 1 }}>
      <View style={styles.header}>
        <Text style={[styles.headerLabel, { color: textColor }]}>所有板块</Text>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => {
            navigation.navigate("ForumSettings");
          }}>
          <Octicon name="gear" color={textColor} size={22} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.list}>
        {forums
          ?.filter((forum) => !forum.hide)
          ?.map((forum) => (
            <TouchableOpacity
              key={forum.id}
              style={[
                styles.item,
                { backgroundColor: forum.id === thread ? tintBackgroundColor : "transparent" },
              ]}
              onPress={onPress.bind(null, forum)}>
              <Text
                style={[styles.itemLabel, { color: forum.id === thread ? tintColor : textColor }]}>
                {forum.name}
              </Text>
            </TouchableOpacity>
          ))}
        <View style={styles.placeholder} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 32,
  },
  headerLabel: {
    fontSize: 18,
  },
  headerIcon: {
    padding: 1,
  },
  list: {
    paddingTop: 4,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 22,
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  itemLabel: {
    fontSize: 14,
    lineHeight: 16,
  },
  placeholder: {
    height: 20,
  },
});
