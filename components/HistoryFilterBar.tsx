import { StyleSheet } from "react-native";

import { Button, Text, useThemeColor, View } from "@/components/Themed";
import { defaultHistoryRange, getHistoryRangeLabel, HistoryRange } from "@/utils/historyRange";

export default function HistoryFilterBar(props: {
  range: HistoryRange;
  count: number;
  total: number;
  onClear: (range: HistoryRange) => void;
}) {
  const { range, count, total, onClear } = props;
  const borderColor = useThemeColor({}, "border");

  if (range.preset === "all") {
    return null;
  }

  return (
    <View style={[styles.bar, { borderBottomColor: borderColor }]}>
      <Text numberOfLines={1} style={styles.label} lightColor="#666666" darkColor="#999999">
        {getHistoryRangeLabel(range)} · {count}/{total} 条
      </Text>
      <Button title="显示全部" onPress={() => onClear(defaultHistoryRange)} />
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
