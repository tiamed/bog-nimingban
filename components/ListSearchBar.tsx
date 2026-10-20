import { useContext } from "react";
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

import { LayoutConfigContext, SizeContext } from "@/Provider";
import Icon from "@/components/Icon";
import { TextInput, useSecondaryTextColor, useThemeColor, View } from "@/components/Themed";

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
  const BASE_SIZE = useContext(SizeContext);
  const { fontFamily } = useContext(LayoutConfigContext);
  const inputBackground = useThemeColor({}, "quoteBackground");
  const borderColor = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");
  const secondaryColor = useSecondaryTextColor();

  return (
    <View style={[styles.inputWrapper, { backgroundColor: inputBackground, borderColor }, style]}>
      <Icon family="Octicons" name="search" color={secondaryColor} size={16} />
      <TextInput
        style={[styles.input, { color: textColor, fontSize: BASE_SIZE, fontFamily }]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={secondaryColor}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
      />
      {value ? (
        <TouchableOpacity
          accessibilityLabel="清空搜索内容"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => onChangeText("")}>
          <Icon family="Ionicons" name="close-circle" color={secondaryColor} size={18} />
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
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});
