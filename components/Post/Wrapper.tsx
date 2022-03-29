import { Dimensions } from "react-native";
import { useThemeColor, View } from "../Themed";

export default function Wrapper(props: {
  children: React.ReactElement | React.ReactElement[];
}) {
  const borderColor = useThemeColor({}, "border");

  return (
    <View
      style={{
        width: Dimensions.get("window").width,
        borderBottomColor: borderColor,
        alignSelf: "center",
        flexDirection: "column",
        padding: 8,
        borderBottomWidth: 1,
      }}
    >
      {props.children}
    </View>
  );
}
