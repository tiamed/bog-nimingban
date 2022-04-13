import * as Updates from "expo-updates";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

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

export async function manualUpdate() {
  const isAvailable = await checkUpdateAvailability();
  if (!isAvailable) {
    Toast.show({ type: "info", text1: "暂无更新" });
    return;
  }
  const { manifest, isNew } = await Updates.fetchUpdateAsync();
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
