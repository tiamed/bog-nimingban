import { useAtom } from "jotai";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";

import Picker from "./Picker";
import { SizeContext } from "./ThemeContextProvider";
import { Text } from "./Themed";

interface Option {
  label: string;
  value: any;
  id?: string;
}

export default function SettingPicker(props: { title: string; atom: any; options: Option[] }) {
  const [value, setValue] = useAtom(props.atom);
  const BASE_SIZE = useContext(SizeContext);

  return (
    <View style={[styles.item, { minHeight: BASE_SIZE * 4 }]}>
      <Text style={styles.itemLabel}>{props.title}</Text>
      <Picker
        selectedValue={value as string | undefined}
        onValueChange={(val: string) => setValue(val)}
        options={props.options}
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
});
