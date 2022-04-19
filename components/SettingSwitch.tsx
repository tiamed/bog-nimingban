import { useAtom } from "jotai";
import { useContext } from "react";
import { StyleSheet, View, Switch } from "react-native";

import { SizeContext } from "./ThemeContextProvider";
import { Text, useThemeColor } from "./Themed";

export default function SettingSwitch(props: { title: string; atom: any }) {
  const [value, setValue] = useAtom<boolean, boolean, void>(props.atom);
  const BASE_SIZE = useContext(SizeContext);
  const activeColor = useThemeColor({}, "active");
  const inactiveColor = useThemeColor({}, "inactive");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <View style={[styles.item, { minHeight: BASE_SIZE * 4 }]}>
      <Text style={styles.itemLabel}>{props.title}</Text>
      <Switch
        trackColor={{ false: inactiveColor, true: activeColor }}
        thumbColor={value ? activeColor : inactiveColor}
        ios_backgroundColor={backgroundColor}
        onValueChange={() => setValue(!value)}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  itemLabel: {
    minWidth: "40%",
  },
});
