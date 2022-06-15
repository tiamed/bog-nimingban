import { useAtom } from "jotai";
import { View } from "react-native";

import { bottomGapAtom, responsiveWidthAtom } from "@/atoms";
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
  const [responsiveWidth] = useAtom(responsiveWidthAtom);

  return (
    <View
      style={{
        width: props.width || responsiveWidth,
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
