import { View, StyleSheet, Platform } from "react-native";

import { Text, useThemeColor } from "@/components/Themed";

export default function HeaderTitle(props: { children: string; tintColor?: string }) {
  const { children } = props;
  const [title, subTitle] = children.split(",");
  const cardTextColor = useThemeColor({}, "cardText");
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: cardTextColor }]}>{title}</Text>
      <Text style={[styles.subTitle, { color: cardTextColor }]}>{subTitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: Platform.select({
    ios: {
      flexDirection: "column",
      alignItems: "center",
      height: 30,
    },
    android: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      alignContent: "center",
    },
    default: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      alignContent: "center",
    },
  }),
  title: Platform.select({
    ios: {
      fontSize: 14,
      fontWeight: "600",
    },
    android: {
      fontSize: 16,
      fontFamily: "sans-serif-medium",
      fontWeight: "normal",
    },
    default: {
      fontSize: 14,
      fontWeight: "500",
    },
  }),
  subTitle: Platform.select({
    ios: {
      fontSize: 10,
      fontWeight: "600",
    },
    android: {
      fontSize: 10,
      fontFamily: "sans-serif-medium",
      fontWeight: "normal",
    },
    default: {
      fontSize: 10,
      fontWeight: "500",
    },
  }),
});
