import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";

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
