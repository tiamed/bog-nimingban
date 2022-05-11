import { format, formatDistance, formatRelative } from "date-fns";
import { zhCN } from "date-fns/locale";
import { decode } from "html-entities";
import { convert } from "html-to-text";

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

export function normalizeHtml(html: string): string {
  return convert(decode(html)?.replace(/网页链接<\/a>/g, "</a>"));
}
