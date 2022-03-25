import { useAtom } from "jotai";

import { useEffect } from "react";

import { Forum, getForums } from "../api";
import { forumsAtom, forumsIdMapAtom } from "../atoms";

export default function useForums() {
  const [forums, setForums] = useAtom<Forum[], Forum[], void>(forumsAtom);
  useEffect(() => {
    if (forums) {
      if (forums.length === 0) {
        getForums().then(({ data: { info } }) => {
          setForums(info);
        });
      }
    }
  }, [forums]);
  return forums;
}

export function useForumsIdMap() {
  const [idMap] = useAtom(forumsIdMapAtom);
  return idMap;
}
