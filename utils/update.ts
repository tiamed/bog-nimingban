import { nativeApplicationVersion } from "expo-application";
import * as Updates from "expo-updates";

import { formatTime } from "./format";

export const getNativeVersion = () => nativeApplicationVersion;

export const getUpdateVersion = () => Updates.updateId?.split("-")[0];

export const getVersion = () => {
  const updateVersion = getUpdateVersion();
  const nativeVersion = getNativeVersion();
  const createdAt = Updates.createdAt ? formatTime(Updates.createdAt?.getTime(), true) : "";
  return updateVersion ? `${updateVersion}@${nativeVersion}(${createdAt})` : nativeVersion;
};
