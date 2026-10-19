import { normalizeHtml } from "@/utils/format";

export interface SearchableItem {
  id?: number;
  res?: number;
  title?: string;
  name?: string;
  cookie?: string;
  content?: string;
  forum?: number;
}

const searchTextCache = new WeakMap<object, string>();

function getSearchText(item: SearchableItem, forumNames?: Map<number, string>) {
  let text = searchTextCache.get(item);
  if (text === undefined) {
    let content = "";
    try {
      content = item.content ? normalizeHtml(item.content) : "";
    } catch {
      content = item.content ?? "";
    }
    text = [
      item.id,
      item.id !== undefined ? `No.${item.id} Po.${item.id}` : "",
      item.res || "",
      item.title,
      item.name,
      item.cookie,
      content,
    ]
      .filter(Boolean)
      .join("\n")
      .toLowerCase();
    searchTextCache.set(item, text);
  }
  const forumName = item.forum !== undefined ? forumNames?.get(item.forum) : undefined;
  return forumName ? `${text}\n${forumName.toLowerCase()}` : text;
}

export function getSearchTerms(query: string) {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

export function filterBySearch<T extends SearchableItem>(
  items: T[] | undefined,
  query: string,
  forumNames?: Map<number, string>
): T[] {
  const list = items ?? [];
  const terms = getSearchTerms(query);
  if (!terms.length) {
    return list;
  }
  return list.filter((item) => {
    if (!item) return false;
    const text = getSearchText(item, forumNames);
    return terms.every((term) => text.includes(term));
  });
}
