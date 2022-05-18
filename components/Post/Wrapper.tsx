import { useAtom } from "jotai";
import { Dimensions, View } from "react-native";

import { bottomGapAtom } from "@/atoms";
import { useThemeColor } from "@/components/Themed";
import Layout from "@/constants/Layout";

export default function Wrapper(props: {
  width?: number | string;
  bottomGap?: boolean;
  withPadding?: boolean;
  children: React.ReactNode;
}) {
  const borderColor = useThemeColor({}, "border");
  const [bottomGap] = useAtom(bottomGapAtom);

  return (
    <View
      style={{
        width: props.width || Dimensions.get("window").width,
        borderBottomColor: borderColor,
        alignSelf: "center",
        flexDirection: "column",
        padding: 8,
        paddingHorizontal: props.withPadding
          ? Layout.postHorizontalPadding
          : Layout.postHorizontalPaddingSecondary,
        borderBottomWidth: props.bottomGap ? bottomGap : 1,
      }}>
      {props.children}
    </View>
  );
}
