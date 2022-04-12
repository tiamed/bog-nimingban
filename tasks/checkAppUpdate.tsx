import * as Updates from "expo-updates";
import Toast from "react-native-toast-message";

export async function checkUpdate() {
  if (__DEV__) return;
  try {
    const { isAvailable } = await Updates.checkForUpdateAsync();
    if (isAvailable) {
      return await update();
    }
    return isAvailable;
  } catch (error) {
    Toast.show({ type: "error", text1: (error as Error).message });
    throw error;
  }
}

async function update() {
  const { manifest, isNew } = await Updates.fetchUpdateAsync();
  if (manifest && isNew) {
    Toast.show({ type: "info", text1: "正在更新..." });
    await Updates.reloadAsync();
  }
  return isNew;
}
