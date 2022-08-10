import Slider from "@react-native-community/slider";
import { useAtom } from "jotai";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { useDebouncedCallback } from "use-debounce/lib";

import { Text, useThemeColor } from "./Themed";

import { SizeContext } from "@/Provider";

export default function SettingSlider(props: {
  title: string;
  atom: any;
  min: number;
  max: number;
  step?: number;
}) {
  const [value, setValue] = useAtom(props.atom);
  const BASE_SIZE = useContext(SizeContext);
  const tintColor = useThemeColor({}, "tint");
  const inactiveColor = useThemeColor({}, "inactive");

  const debouncedSetValue = useDebouncedCallback(setValue, 200, {
    trailing: true,
  });

  return (
    <View style={[styles.item, { minHeight: BASE_SIZE * 4 }]}>
      <Text style={styles.itemLabel}>{props.title}</Text>
      <Slider
        value={value as number | undefined}
        onValueChange={debouncedSetValue}
        minimumValue={props.min}
        maximumValue={props.max}
        step={props.step}
        thumbTintColor={tintColor}
        minimumTrackTintColor={tintColor}
        maximumTrackTintColor={inactiveColor}
        style={styles.slider}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  itemLabel: {
    minWidth: "40%",
  },
  slider: {
    width: "60%",
  },
});
