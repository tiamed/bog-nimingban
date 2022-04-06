import { Picker } from "@react-native-picker/picker";
import { useAtom } from "jotai";
import { StyleSheet } from "react-native";

import { useThemeColor, View, Text } from "./Themed";

interface Option {
  label: string;
  value: any;
}

export default function SettingPicker(props: { title: string; atom: any; options: Option[] }) {
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const [value, setValue] = useAtom(props.atom);

  return (
    <View style={styles.item}>
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
