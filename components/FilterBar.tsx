import { StyleSheet } from "react-native";

import { Button, Text, useSecondaryTextColor, useThemeColor, View } from "@/components/Themed";

export default function FilterBar(props: { label: string; onClear: () => void }) {
  const borderColor = useThemeColor({}, "border");
  const secondaryColor = useSecondaryTextColor();

  return (
    <View style={[styles.bar, { borderBottomColor: borderColor }]}>
      <Text numberOfLines={1} style={[styles.label, { color: secondaryColor }]}>
        {props.label}
      </Text>
      <Button title="清除筛选" accessibilityLabel="清除筛选" onPress={props.onClear} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    flex: 1,
    marginRight: 10,
  },
});
