import { useMemo } from "react";

import { useForumsIdMap } from "@/hooks/useForums";
import { filterBySearch, getSearchTerms, SearchableItem } from "@/utils/listSearch";

export default function useListSearch<T extends SearchableItem>(items: T[], query: string) {
  const forumNames = useForumsIdMap();
  const results = useMemo(
    () => filterBySearch(items, query, forumNames),
    [items, query, forumNames]
  );
  return { results, searching: getSearchTerms(query).length > 0 };
}
