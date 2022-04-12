import { format, formatDistance, formatRelative } from "date-fns";
import { zhCN } from "date-fns/locale";

export function formatTime(time: number, accurate: boolean): string {
  if (accurate) {
    return format(time, "yyyy-MM-dd HH:mm:ss");
  }
  const now = Date.now();
  const diff = now - time;
  if (diff < 1000 * 60 * 60 * 24) {
    return formatDistance(now, time, {
      locale: zhCN,
      addSuffix: true,
    });
  }
  return formatRelative(time, now, {
    locale: zhCN,
  });
}
