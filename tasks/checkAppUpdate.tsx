import * as Updates from "expo-updates";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

import { checkRelease } from "./checkRelease";

export async function checkUpdate() {
  const isAvailable = await checkUpdateAvailability();
  if (isAvailable) {
    return await update();
  }
}

async function checkUpdateAvailability() {
  if (__DEV__) {
    Toast.show({
      type: "info",
      text1: "开发环境不能热更新",
    });
    return;
  }
  try {
    const { isAvailable } = await Updates.checkForUpdateAsync();
    return isAvailable;
  } catch (error) {
    Toast.show({ type: "error", text1: (error as Error).message });
    return false;
  }
}

function confirmUpdateAsync(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert("更新提示", "发现新版本，确认更新吗？", [
      {
        text: "取消",
        onPress: () => resolve(false),
      },
      {
        text: "确认",
        onPress: () => resolve(true),
      },
    ]);
  });
}

export async function manualUpdate(needConfirm?: boolean) {
  const hasNewRelease = await checkRelease();
  if (hasNewRelease) return;
  const isAvailable = await checkUpdateAvailability();
  if (!isAvailable) {
    if (!needConfirm) {
      Toast.show({ type: "info", text1: "暂无更新" });
    }
    return;
  } else {
    if (needConfirm) {
      const confirmed = await confirmUpdateAsync();
      if (!confirmed) return;
    }
    Toast.show({ type: "info", text1: "正在更新...", autoHide: false });
  }
  const { manifest, isNew } = await Updates.fetchUpdateAsync();
  Toast.hide();
  if (manifest && isNew) {
    Alert.alert(
      "提示",
      "更新已完成，是否重启？",
      [
        {
          text: "取消",
        },
        {
          text: "确认",
          onPress: () => {
            Updates.reloadAsync();
          },
        },
      ],
      { cancelable: false }
    );
  } else {
    Toast.show({
      type: "info",
      text1: "暂无更新",
    });
  }
}

async function update() {
  Toast.show({ type: "info", text1: "正在更新..." });
  const { isNew } = await Updates.fetchUpdateAsync();
  return isNew;
}
