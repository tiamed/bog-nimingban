import { useAppState } from "@react-native-community/hooks";
import { useAtom } from "jotai";
import { useEffect } from "react";

import { manualUpdate } from "./checkAppUpdate";

import { lastCheckUpdateAtom, checkUpdateIntervalAtom } from "@/atoms";

export default function useCheckVersionUpdate() {
  const [lastCheckUpdate, setLastCheckUpdate] = useAtom(lastCheckUpdateAtom);
  const [checkUpdateInterval] = useAtom(checkUpdateIntervalAtom);
  const currentAppState = useAppState();
  useEffect(() => {
    if (currentAppState === "active") {
      if (Date.now() - lastCheckUpdate > checkUpdateInterval && lastCheckUpdate !== null) {
        manualUpdate(true);
        setLastCheckUpdate(Date.now());
      }
    }
  }, [currentAppState]);
}
