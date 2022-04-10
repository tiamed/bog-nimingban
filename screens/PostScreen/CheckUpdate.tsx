import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Snackbar, DefaultTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getPostById } from "@/api";
import { shouldPollPostAtom } from "@/atoms";
import { Text, useThemeColor } from "@/components/Themed";

export default function CheckUpdate(props: { id: number; count: number; onUpdate: () => void }) {
  const [visible, setVisible] = useState(false);
  const [canUpdate] = useAtom(shouldPollPostAtom);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [intervalId, setIntervalId] = useState<any>(null);
  const [count, setCount] = useState(0);
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "background");
  const insets = useSafeAreaInsets();

  const register = () => {
    if (!intervalId) {
      const id = setInterval(() => {
        setShouldUpdate(true);
      }, 1000 * 30);
      setIntervalId(id);
    }
  };

  const unregister = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
    }
  };

  const checkUpdate = async () => {
    const {
      data: { info },
    } = await getPostById(props.id);
    if (info?.reply_count > (count || props.count)) {
      unregister();
      setVisible(true);
      setCount(info.reply_count);
    }
    setShouldUpdate(false);
  };

  useEffect(() => {
    if (canUpdate) {
      register();
    } else {
      unregister();
    }
    return unregister;
  }, [canUpdate]);

  useEffect(() => {
    if (shouldUpdate) {
      checkUpdate();
    }
  }, [shouldUpdate]);

  useEffect(() => {
    setCount(count);
  }, [props.count]);

  return (
    <Snackbar
      visible={visible}
      wrapperStyle={{
        bottom: 50 + insets.bottom,
      }}
      onDismiss={() => {
        setVisible(false);
        register();
      }}
      style={{ backgroundColor: tintColor }}
      theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, accent: textColor, text: textColor },
      }}
      action={{
        label: "查看",
        onPress: () => {
          props.onUpdate();
          setVisible(false);
        },
      }}>
      <TouchableOpacity
        hitSlop={{ left: 20, right: 1000, top: 20, bottom: 20 }}
        onPress={() => {
          setVisible(false);
        }}>
        <Text style={{ color: textColor }}>有新的回复</Text>
      </TouchableOpacity>
    </Snackbar>
  );
}
