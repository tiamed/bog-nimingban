import { FontAwesome } from "@expo/vector-icons";
import useSize from "../hooks/useSize";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
export default function Icon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  const BASE_SIZE = useSize();
  return (
    <FontAwesome
      size={BASE_SIZE * 1.25}
      style={{ marginBottom: 0 }}
      {...props}
    />
  );
}
