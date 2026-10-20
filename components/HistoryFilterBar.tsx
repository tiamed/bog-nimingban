import FilterBar from "@/components/FilterBar";
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
  const searching = getSearchTerms(query).length > 0;

  if (range.preset === "all" && !searching) {
    return null;
  }

  const labels = [
    range.preset !== "all" ? getHistoryRangeLabel(range) : "",
    searching ? formatSearchLabel(query) : "",
  ].filter(Boolean);

  return <FilterBar label={`${labels.join(" · ")} · ${count}/${total} 条`} onClear={onClear} />;
}
