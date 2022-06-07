import { createIconSetFromIcoMoon, FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import { useContext } from "react";
import { StyleProp, TextStyle } from "react-native";

import { SizeContext } from "@/Provider";

const BogIcons = createIconSetFromIcoMoon(
  require("@/assets/icomoon/selection.json"),
  "BogIcons",
  "icomoon.ttf"
);

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
export default function Icon(props: {
  name:
    | React.ComponentProps<typeof FontAwesome>["name"]
    | React.ComponentProps<typeof Ionicons>["name"]
    | React.ComponentProps<typeof Octicons>["name"]
    | React.ComponentProps<typeof BogIcons>["name"];
  family?: "FontAwesome" | "Ionicons" | "Octicons" | "BogIcons";
  color: string;
  size?: number;
  style?: StyleProp<TextStyle>;
}) {
  const BASE_SIZE = useContext(SizeContext);
  const { family = "FontAwesome", name, ...otherProps } = props;
  switch (family) {
    case "FontAwesome":
      return (
        <FontAwesome
          name={name as React.ComponentProps<typeof FontAwesome>["name"]}
          size={BASE_SIZE * 1.25}
          {...otherProps}
        />
      );
    case "Ionicons":
      return (
        <Ionicons
          name={name as React.ComponentProps<typeof Ionicons>["name"]}
          size={BASE_SIZE * 1.25}
          {...otherProps}
        />
      );
    case "Octicons":
      return (
        <Octicons
          name={name as React.ComponentProps<typeof Octicons>["name"]}
          size={BASE_SIZE * 1.25}
          {...otherProps}
        />
      );
    case "BogIcons":
      return (
        <BogIcons
          name={name as React.ComponentProps<typeof BogIcons>["name"]}
          size={BASE_SIZE * 1.25}
          {...otherProps}
        />
      );
    default:
      return (
        <FontAwesome
          name={name as React.ComponentProps<typeof FontAwesome>["name"]}
          size={BASE_SIZE * 1.25}
          {...otherProps}
        />
      );
  }
}

export function Ionicon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  size?: number;
  style?: StyleProp<TextStyle>;
}) {
  const BASE_SIZE = useContext(SizeContext);
  return <Ionicons size={BASE_SIZE * 1.25} {...props} />;
}

export function Octicon(props: {
  name: React.ComponentProps<typeof Octicons>["name"];
  color: string;
  size?: number;
  style?: StyleProp<TextStyle>;
}) {
  const BASE_SIZE = useContext(SizeContext);
  return <Octicons size={BASE_SIZE * 1.25} {...props} />;
}

export function TabBarIcon(props: {
  name: React.ComponentProps<typeof Octicons>["name"];
  color: string;
  size?: number;
}) {
  const BASE_SIZE = useContext(SizeContext);
  return <Octicons size={BASE_SIZE * 1.4} style={{ marginBottom: 0 }} {...props} />;
}

export function BogIcon(props: {
  name: React.ComponentProps<typeof BogIcons>["name"];
  color?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
}) {
  const BASE_SIZE = useContext(SizeContext);
  return <BogIcons size={BASE_SIZE * 1.25} {...props} />;
}
