import { Alert, Linking, Platform } from "react-native";

import { getReleases } from "@/api";
import Urls from "@/constants/Urls";
import { getVersion } from "@/utils/update";

function cleanVersion(version: string) {
  const v = version.split(".");
  return v.map((x) => x?.match(/\d+/)?.[0]).join(".");
}

function compareVersion(version1: string, version2: string) {
  const v1 = version1.split(".");
  const v2 = version2.split(".");
  for (let i = 0; i < v1.length; i++) {
    const v1i = parseInt(v1[i], 10);
    const v2i = parseInt(v2[i], 10);
    if (v1i > v2i) {
      return 1;
    } else if (v1i < v2i) {
      return -1;
    }
  }
  return 0;
}

export function checkReleaseFromGithubWithData(releases: any[]) {
  const latestRelease = releases[0];
  const latestVersion = latestRelease?.tag_name;
  const latestApk = latestRelease?.assets.find((a: any) =>
    a.name.includes(".apk")
  )?.browser_download_url;
  const hasNewerVersion =
    compareVersion(cleanVersion(latestVersion), cleanVersion(getVersion()!)) > 0;
  if (hasNewerVersion && latestApk) {
    Alert.alert("更新", `发现新版本 ${latestVersion}`, [
      { text: "取消" },
      { text: "蓝奏云", onPress: () => Linking.openURL(Urls.lanzou) },
      { text: "更新", onPress: () => Linking.openURL(latestApk) },
    ]);
    return true;
  }
  return false;
}

export async function checkReleaseFromGithub() {
  const { data: releases } = await getReleases();
  return checkReleaseFromGithubWithData(releases);
}

export async function checkRelease() {
  if (Platform.OS === "android") {
    return await checkReleaseFromGithub();
  }
  return false;
}
