import { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import Icon from "./Icon";
import { Text, useThemeColor } from "./Themed";

import { SizeContext } from "@/Provider";

export default function SettingItem(props: { title: string; desc?: string; onPress: () => void }) {
  const tintColor = useThemeColor({}, "tint");
  const inactiveColor = useThemeColor({}, "inactive");
  const BASE_SIZE = useContext(SizeContext);
  return (
    <View>
      <TouchableOpacity style={styles.item} onPress={props.onPress}>
        <View style={styles.itemLabel}>
          <Text style={{ ...styles.itemLabel, color: tintColor }}>{props.title}</Text>
          {props.desc && (
            <Text style={{ ...styles.itemLabel, color: inactiveColor, fontSize: BASE_SIZE * 0.8 }}>
              {props.desc}
            </Text>
          )}
        </View>
        <Icon name="chevron-right" color={tintColor} size={BASE_SIZE} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    paddingRight: 15,
  },
  itemLabel: {
    minWidth: "20%",
  },
});
