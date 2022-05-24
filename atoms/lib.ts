import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";

import { getItemChunked, setItemChunked } from "@/utils/chunkedAsyncStorage";

export const atomWithAsyncStorage = (
  key: string,
  initialValue: any,
  lateInit = false,
  expiresIn = 0
) => {
  const baseAtom = lateInit ? atom(null) : atom(initialValue);
  baseAtom.onMount = (setValue: (arg0: any) => void) => {
    (async () => {
      const item = await AsyncStorage.getItem(key);
      const lastModify = await AsyncStorage.getItem(`${key}_lastModify`);
      const notExpired = !expiresIn || Date.now() - Number(lastModify) < expiresIn;
      if (item && notExpired) {
        setValue(JSON.parse(item));
      } else {
        setValue(initialValue);
      }
    })();
  };
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue = typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      AsyncStorage.setItem(key, JSON.stringify(nextValue));
      AsyncStorage.setItem(`${key}_lastModify`, Date.now().toString());
    }
  );
  return derivedAtom;
};

export const atomWithAsyncStorageChunked = (
  key: string,
  initialValue: any,
  lateInit = false,
  chunkSize = 500
) => {
  const baseAtom = lateInit ? atom(null) : atom(initialValue);
  baseAtom.onMount = (setValue: (arg0: any) => void) => {
    (async () => {
      const item = await getItemChunked(key);
      setValue(item || initialValue);
      if (!item.length) {
        const originalValue = await AsyncStorage.getItem(key);
        if (originalValue) {
          setItemChunked(key, originalValue ? JSON.parse(originalValue) : initialValue, chunkSize);
          setValue(originalValue ? JSON.parse(originalValue) : initialValue);
          AsyncStorage.removeItem(key);
        }
      }
    })();
  };
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue = typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      setItemChunked(key, nextValue, chunkSize);
    }
  );
  return derivedAtom;
};
