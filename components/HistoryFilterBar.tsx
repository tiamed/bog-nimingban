import { StyleSheet } from "react-native";

import { Button, Text, useThemeColor, View } from "@/components/Themed";
import { getHistoryRangeLabel, HistoryRange } from "@/utils/historyRange";
import { formatSearchLabel, getSearchTerms } from "@/utils/listSearch";

export default function HistoryFilterBar(props: {
  range: HistoryRange;
  query: string;
  count: number;
  total: number;
  onClear: () => void;
}) {
  const { range, query, count, total, onClear } = props;
  const borderColor = useThemeColor({}, "border");
  const searching = getSearchTerms(query).length > 0;

  if (range.preset === "all" && !searching) {
    return null;
  }

  const labels = [
    range.preset !== "all" ? getHistoryRangeLabel(range) : "",
    searching ? formatSearchLabel(query) : "",
  ].filter(Boolean);

  return (
    <View style={[styles.bar, { borderBottomColor: borderColor }]}>
      <Text numberOfLines={1} style={styles.label} lightColor="#666666" darkColor="#999999">
        {labels.join(" · ")} · {count}/{total} 条
      </Text>
      <Button title="清除筛选" onPress={onClear} />
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
