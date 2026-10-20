import { describe, expect, it } from "@jest/globals";

import { filterBySearch, formatSearchLabel, getSearchTerms } from "../listSearch";

const items = [
  {
    id: 50123456,
    res: 0,
    title: "今日份摸鱼",
    name: "",
    cookie: "AbC123",
    content: "<b>Hello</b> world<br />第二行",
    forum: 4,
  },
  { id: 50999999, res: 50123456, cookie: "xyz789", content: "回复 &gt;&gt;No.50123456 收到" },
  { id: 51000000, res: 0, title: "", cookie: "qwe", content: "<a href='x'>网页链接</a>" },
];
const forumNames = new Map([[4, "综合版1"]]);
const ids = (list: { id: number }[]) => list.map(({ id }) => id);

describe("filterBySearch", () => {
  it("returns everything for an empty query", () => {
    expect(filterBySearch(items, "   ")).toHaveLength(3);
    expect(filterBySearch(undefined, "a")).toEqual([]);
  });

  it("matches plain text content, ignoring html tags", () => {
    expect(ids(filterBySearch(items, "hello world"))).toEqual([50123456]);
    expect(ids(filterBySearch(items, "<b>"))).toEqual([]);
    expect(ids(filterBySearch(items, "第二行"))).toEqual([50123456]);
  });

  it("matches title, cookie and forum name case-insensitively", () => {
    expect(ids(filterBySearch(items, "摸鱼"))).toEqual([50123456]);
    expect(ids(filterBySearch(items, "abc123"))).toEqual([50123456]);
    expect(ids(filterBySearch(items, "综合版", forumNames))).toEqual([50123456]);
  });

  it("matches ids, reply targets and No./Po. prefixes", () => {
    expect(ids(filterBySearch(items, "50123456"))).toEqual([50123456, 50999999]);
    expect(ids(filterBySearch(items, "po.51000000"))).toEqual([51000000]);
  });

  it("requires every term to match", () => {
    expect(ids(filterBySearch(items, "收到 xyz"))).toEqual([50999999]);
    expect(ids(filterBySearch(items, "收到 qwe"))).toEqual([]);
  });
});

describe("formatSearchLabel", () => {
  it("quotes and truncates the query", () => {
    expect(formatSearchLabel("  摸鱼 ")).toBe("“摸鱼”");
    expect(formatSearchLabel("abcdefghijk", 4)).toBe("“abcd…”");
  });
});

describe("getSearchTerms", () => {
  it("splits on whitespace and lowercases", () => {
    expect(getSearchTerms("  Foo   BAR ")).toEqual(["foo", "bar"]);
  });
});
