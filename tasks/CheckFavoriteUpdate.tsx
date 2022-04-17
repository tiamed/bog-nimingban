import { useAtom } from "jotai";
import { useEffect } from "react";
import { useBoolean, useInterval } from "usehooks-ts";

import { getPostById } from "@/api";
import { favoriteAtom } from "@/atoms";
import { UserFavorite } from "@/screens/FavoriteScreen";

export default function CheckFavoriteUpdate() {
  const [favorite, setFavorite] = useAtom<UserFavorite[], UserFavorite[], void>(favoriteAtom);
  const { value, setTrue, setFalse } = useBoolean();

  useEffect(() => {
    if (favorite?.length) {
      setTrue();
    } else {
      setFalse();
    }
  }, [favorite]);

  useInterval(
    async () => {
      const mostOutdated = favorite.reduce((prev, current) => {
        return Math.max(prev?.lastUpdate || 0, prev.createTime) <
          Math.max(current?.lastUpdate || 0, current.createTime)
          ? prev
          : current;
      });
      const {
        data: { info },
      } = await getPostById(mostOutdated.id);
      const { reply_count, ...rest } = info;
      const newRecord: Partial<UserFavorite> = { lastUpdate: Date.now() };
      if (reply_count) {
        newRecord.newReplyCount = reply_count;
      }
      const updatedFavorite = favorite.map((record) => {
        if (record.id === mostOutdated.id) {
          return {
            ...record,
            ...rest,
            ...newRecord,
          };
        }
        return record;
      });
      setFavorite(updatedFavorite);
    },
    value ? 2 * 60 * 1000 : null
  );
  return null;
}
