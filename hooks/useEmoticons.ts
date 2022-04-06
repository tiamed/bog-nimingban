import { useAtom } from "jotai";
import { useEffect } from "react";

import { getEmoticons } from "@/api";
import { emoticonsAtom } from "@/atoms";

interface Emoticon {
  name: string;
  value: string[];
}

export default function useForums() {
  const [emoticons, setEmoticons] = useAtom<Emoticon[], Emoticon[], void>(emoticonsAtom);
  useEffect(() => {
    if (emoticons) {
      if (emoticons.length === 0) {
        getEmoticons().then(({ data }) => {
          setEmoticons(
            Object.entries(data).map(([key, value]) => ({
              name: key,
              value,
            }))
          );
        });
      }
    }
  }, [emoticons]);
  return emoticons;
}
