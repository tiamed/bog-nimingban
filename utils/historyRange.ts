import { endOfDay, format, isSameYear, startOfDay, subDays } from "date-fns";

export type HistoryRangePreset = "all" | "today" | "7d" | "30d" | "custom";

export interface HistoryRange {
  preset: HistoryRangePreset;
  start?: number;
  end?: number;
}

export const defaultHistoryRange: HistoryRange = { preset: "all" };

export const historyRangePresets: {
  preset: Exclude<HistoryRangePreset, "custom">;
  label: string;
}[] = [
  { preset: "all", label: "全部" },
  { preset: "today", label: "今天" },
  { preset: "7d", label: "近7天" },
  { preset: "30d", label: "近30天" },
];

export function getHistoryRangeBounds(
  range: HistoryRange,
  now: number = Date.now()
): { start: number; end: number } | null {
  switch (range.preset) {
    case "today":
      return { start: startOfDay(now).getTime(), end: Infinity };
    case "7d":
      return { start: startOfDay(subDays(now, 6)).getTime(), end: Infinity };
    case "30d":
      return { start: startOfDay(subDays(now, 29)).getTime(), end: Infinity };
    case "custom":
      return {
        start: range.start !== undefined ? startOfDay(range.start).getTime() : -Infinity,
        end: range.end !== undefined ? endOfDay(range.end).getTime() : Infinity,
      };
    default:
      return null;
  }
}

export function filterHistoryByRange<T extends { createTime: number }>(
  items: T[] | undefined,
  range: HistoryRange,
  now: number = Date.now()
): T[] {
  const list = items ?? [];
  const bounds = getHistoryRangeBounds(range, now);
  if (!bounds) {
    return list;
  }
  return list.filter((item) => item?.createTime >= bounds.start && item?.createTime <= bounds.end);
}

export function formatHistoryDate(time: number, now: number = Date.now()) {
  return format(time, isSameYear(time, now) ? "M月d日" : "yyyy年M月d日");
}

export function getHistoryRangeLabel(range: HistoryRange, now: number = Date.now()) {
  if (range.preset !== "custom") {
    return historyRangePresets.find(({ preset }) => preset === range.preset)?.label ?? "全部";
  }
  const start = range.start !== undefined ? formatHistoryDate(range.start, now) : "最早";
  const end = range.end !== undefined ? formatHistoryDate(range.end, now) : "现在";
  return start === end ? start : `${start} - ${end}`;
}
