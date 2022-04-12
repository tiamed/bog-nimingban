import { useCallback, useEffect, useState } from "react";
import { InteractionManager, TouchableOpacity } from "react-native";
import { Snackbar, DefaultTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInterval } from "usehooks-ts";

import { getPostById } from "@/api";
import { Text, useThemeColor } from "@/components/Themed";

export default function CheckUpdate(props: { id: number; count: number; onUpdate: () => void }) {
  const [visible, setVisible] = useState(false);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);
  const [count, setCount] = useState(0);
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "background");
  const insets = useSafeAreaInsets();

  const checkUpdate = useCallback(async () => {
    const {
      data: { info },
    } = await getPostById(props.id);
    if (info?.reply_count > (count || props.count)) {
      setIsRegistered(false);
      setVisible(true);
      setCount(info.reply_count);
    }
    setShouldUpdate(false);
  }, [props.count, count]);

  useEffect(() => {
    if (shouldUpdate) {
      InteractionManager.runAfterInteractions(checkUpdate);
    }
  }, [shouldUpdate]);

  useEffect(() => {
    setCount(count);
  }, [props.count]);

  useInterval(
    () => {
      InteractionManager.runAfterInteractions(checkUpdate);
    },
    isRegistered ? 30000 : null
  );

  return (
    <Snackbar
      visible={visible}
      wrapperStyle={{
        bottom: 50 + insets.bottom,
      }}
      onDismiss={() => {
        setVisible(false);
        setIsRegistered(true);
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
