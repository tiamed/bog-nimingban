import AsyncStorage from "@react-native-async-storage/async-storage";

const chunk = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

export async function setItemChunked(key: string, array: any[], chunkSize = 500) {
  await AsyncStorage.multiSet(
    chunk(array, chunkSize).map((chunk, index) => [`${key}${index}`, JSON.stringify(chunk)])
  );
}

export async function getItemChunked(key: string) {
  const keys = await AsyncStorage.getAllKeys();
  const strings = await AsyncStorage.multiGet(keys.filter((key) => /history\d+/.test(key)));
  return strings.map(([key, value]) => JSON.parse(value || "[]")).flat();
}
