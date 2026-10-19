import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import { useForumsIdMap } from "@/hooks/useForums";
import { filterBySearch, SearchableItem } from "@/utils/listSearch";

export default function useListSearch<T extends SearchableItem>(items: T[]) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 200);
  const forumNames = useForumsIdMap();
  const results = useMemo(
    () => filterBySearch(items, debouncedQuery, forumNames),
    [items, debouncedQuery, forumNames]
  );
  return { query, setQuery, results, searching: debouncedQuery.trim().length > 0 };
}
