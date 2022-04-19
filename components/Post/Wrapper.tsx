import { Dimensions, View } from "react-native";

import { useThemeColor } from "@/components/Themed";

export default function Wrapper(props: { width?: number | string; children: React.ReactNode }) {
  const borderColor = useThemeColor({}, "border");

  return (
    <View
      style={{
        width: props.width || Dimensions.get("window").width,
        borderBottomColor: borderColor,
        alignSelf: "center",
        flexDirection: "column",
        padding: 8,
        borderBottomWidth: 1,
      }}>
      {props.children}
    </View>
  );
}
