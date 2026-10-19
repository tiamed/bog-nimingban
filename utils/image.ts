import { nativeApplicationVersion } from "expo-application";
import { Platform } from "react-native";

// The forum rejects image requests without a Referer, and also rejects okhttp's default User-Agent.
const FORUM_IMAGE_URL = /^https?:\/\/(?:[a-z0-9-]+\.)*bog\.ac(?:\.cn)?\/image(?:_pre)?\//i;

const PLATFORM_NAME =
  Platform.OS === "android" ? "Android" : Platform.OS === "ios" ? "iOS" : Platform.OS;

export const FORUM_IMAGE_USER_AGENT = `BOG-nimingban/${
  nativeApplicationVersion || "unknown"
} (${PLATFORM_NAME}; ${Platform.Version})`;

export const FORUM_IMAGE_HEADERS: Record<string, string> = {
  Referer: "https://bog.ac/",
  "User-Agent": FORUM_IMAGE_USER_AGENT,
};

export function isForumImageUrl(uri?: string | null): uri is string {
  return typeof uri === "string" && FORUM_IMAGE_URL.test(uri);
}

export function getImageHeaders(uri?: string | null): Record<string, string> | undefined {
  return isForumImageUrl(uri) ? FORUM_IMAGE_HEADERS : undefined;
}

export function getImageSource(uri: string): { uri: string; headers?: Record<string, string> } {
  const headers = getImageHeaders(uri);
  return headers ? { uri, headers } : { uri };
}
