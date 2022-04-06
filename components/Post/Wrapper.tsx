import { Dimensions } from "react-native";

import { useThemeColor, View } from "@/components/Themed";

export default function Wrapper(props: {
  width?: number | string;
  children: React.ReactElement | React.ReactElement[];
}) {
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
