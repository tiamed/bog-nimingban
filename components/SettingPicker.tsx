import { Picker } from "@react-native-picker/picker";
import { useAtom } from "jotai";
import { useContext } from "react";
import { StyleSheet } from "react-native";

import { SizeContext } from "./ThemeContextProvider";
import { useThemeColor, View, Text } from "./Themed";

interface Option {
  label: string;
  value: any;
}

export default function SettingPicker(props: { title: string; atom: any; options: Option[] }) {
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const [value, setValue] = useAtom(props.atom);
  const BASE_SIZE = useContext(SizeContext);

  return (
    <View style={[styles.item, { minHeight: BASE_SIZE * 4 }]}>
      <Text style={styles.itemLabel}>{props.title}</Text>
      <Picker
        style={{
          color: tintColor,
          backgroundColor,
          flex: 1,
        }}
        itemStyle={{
          color: tintColor,
        }}
        selectedValue={value as string | undefined}
        onValueChange={(val: string) => setValue(val)}>
        {props.options?.map((option: any) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
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
    minWidth: "30%",
  },
});
