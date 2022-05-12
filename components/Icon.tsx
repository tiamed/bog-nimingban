import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import { useContext } from "react";

import { SizeContext } from "@/Provider";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
export default function Icon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  size?: number;
}) {
  const BASE_SIZE = useContext(SizeContext);
  return <FontAwesome size={BASE_SIZE * 1.25} style={{ marginBottom: 0 }} {...props} />;
}

export function Ionicon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  size?: number;
}) {
  const BASE_SIZE = useContext(SizeContext);
  return <Ionicons size={BASE_SIZE * 1.25} style={{ marginBottom: 0 }} {...props} />;
}

export function Octicon(props: {
  name: React.ComponentProps<typeof Octicons>["name"];
  color: string;
  size?: number;
}) {
  const BASE_SIZE = useContext(SizeContext);
  return <Octicons size={BASE_SIZE * 1.25} style={{ marginBottom: 0 }} {...props} />;
}

export function TabBarIcon(props: {
  name: React.ComponentProps<typeof Octicons>["name"];
  color: string;
  size?: number;
}) {
  const BASE_SIZE = useContext(SizeContext);
  return <Octicons size={BASE_SIZE * 1.4} style={{ marginBottom: 0 }} {...props} />;
}
