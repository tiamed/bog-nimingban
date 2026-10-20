import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

import Icon from "@/components/Icon";
import { TextInput, useThemeColor, View } from "@/components/Themed";

export default function ListSearchBar(props: {
  value: string;
  onChangeText: (value: string) => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const {
    value,
    onChangeText,
    onSubmitEditing,
    placeholder = "搜索内容、标题、串号或饼干",
    style,
  } = props;
  const inactiveColor = useThemeColor({}, "inactive");
  const inputBackground = useThemeColor({}, "quoteBackground");

  return (
    <View style={[styles.inputWrapper, { backgroundColor: inputBackground }, style]}>
      <Icon family="Octicons" name="search" color={inactiveColor} size={16} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
      />
      {value ? (
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => onChangeText("")}>
          <Icon family="Ionicons" name="close-circle" color={inactiveColor} size={18} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});
