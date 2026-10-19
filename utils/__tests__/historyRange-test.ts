import { describe, expect, it } from "@jest/globals";

import { filterHistoryByRange, getHistoryRangeBounds, getHistoryRangeLabel } from "../historyRange";

const now = new Date(2026, 9, 19, 12, 0, 0).getTime();
const day = 24 * 60 * 60 * 1000;
const items = [
  { id: 1, createTime: now - 400 * day },
  { id: 2, createTime: now - 20 * day },
  { id: 3, createTime: now - 3 * day },
  { id: 4, createTime: now - 60 * 1000 },
];
const ids = (list: { id: number }[]) => list.map(({ id }) => id);

describe("filterHistoryByRange", () => {
  it("shows all history by default", () => {
    expect(ids(filterHistoryByRange(items, { preset: "all" }, now))).toEqual([1, 2, 3, 4]);
    expect(getHistoryRangeBounds({ preset: "all" }, now)).toBeNull();
  });

  it("applies relative presets", () => {
    expect(ids(filterHistoryByRange(items, { preset: "today" }, now))).toEqual([4]);
    expect(ids(filterHistoryByRange(items, { preset: "7d" }, now))).toEqual([3, 4]);
    expect(ids(filterHistoryByRange(items, { preset: "30d" }, now))).toEqual([2, 3, 4]);
  });

  it("includes both ends of a custom range", () => {
    const range = { preset: "custom" as const, start: now - 20 * day, end: now - 3 * day };
    expect(ids(filterHistoryByRange(items, range, now))).toEqual([2, 3]);
  });

  it("handles missing history", () => {
    expect(filterHistoryByRange(undefined, { preset: "7d" }, now)).toEqual([]);
  });
});

describe("getHistoryRangeLabel", () => {
  it("labels presets and custom ranges", () => {
    expect(getHistoryRangeLabel({ preset: "30d" }, now)).toBe("近30天");
    expect(getHistoryRangeLabel({ preset: "custom", start: now - 400 * day, end: now }, now)).toBe(
      "2025年9月14日 - 10月19日"
    );
  });
});
