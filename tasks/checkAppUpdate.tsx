import * as Updates from "expo-updates";

Updates.addListener(({ type }) => {
  if (type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
    update();
  }
});

export async function checkUpdate() {
  const { isAvailable } = await Updates.checkForUpdateAsync();
  if (isAvailable) {
    await update();
  }
}

async function update() {
  const { manifest, isNew } = await Updates.fetchUpdateAsync();
  if (manifest && isNew) {
    await Updates.reloadAsync();
  }
}
