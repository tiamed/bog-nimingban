import { useAtom } from "jotai";
import { useEffect } from "react";

import { Forum, getForums } from "@/api";
import { forumsAtom, forumsIdMapAtom, forumsOrderAtom, forumsVisibilityAtom } from "@/atoms";

export default function useForums() {
  const [forums, setForums] = useAtom<Forum[], Forum[], void>(forumsAtom);
  const [order] = useAtom(forumsOrderAtom);
  const [visibility] = useAtom(forumsVisibilityAtom);

  useEffect(() => {
    if (forums) {
      if (forums.length === 0) {
        refreshForums(order, visibility, setForums);
      }
    }
  }, [forums, order, setForums, visibility]);
  return forums;
}

export function useTimelineForums() {
  const forums = useForums();
  return forums.filter((forum) => forum.timeline && forum.id !== 0);
}

export function useReachableForums() {
  const forums = useForums();
  return forums.filter((forum) => !forum.hide && forum.id !== 0);
}

export function useForumsIdMap() {
  const [idMap] = useAtom(forumsIdMapAtom);
  return idMap;
}

export function refreshForums(order: any, visibility: any, setForums: (update: Forum[]) => void) {
  getForums().then(({ data: { info } }) => {
    const withOrder = info.sort((a, b) => {
      return order.indexOf(a.id) - order.indexOf(b.id);
    });
    const withVisibility = withOrder.map((f) =>
      visibility[f.id] === undefined ? f : { ...f, hide: visibility[f.id] as boolean }
    );

    setForums(withVisibility);
  });
}
