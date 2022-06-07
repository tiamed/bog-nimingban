import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from "react-native";

export default function Overlay(props: { style?: Partial<ViewStyle> }) {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback onPress={navigation.goBack}>
      <View style={[styles.overlay, props.style]} />
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "#40404040",
    zIndex: 0,
    position: "absolute",
    flex: 1,
    width: 99999,
    height: 99999,
    top: 0,
    left: 0,
  },
});
