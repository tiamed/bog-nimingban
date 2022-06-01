import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import WebView from "react-native-webview";

import Modal from "@/components/Modal";
import { useThemeColor } from "@/components/Themed";

export default function LongImageModal(props: {
  visible: boolean;
  uri: string;
  onDismiss: () => void;
}) {
  const tintColor = useThemeColor({}, "tint");
  return (
    <Modal isVisible={props.visible} onBackdropPress={props.onDismiss}>
      <WebView source={{ uri: props.uri }} />
      <FloatingAction
        color={tintColor}
        overrideWithAction
        distanceToEdge={{ horizontal: 30, vertical: 30 }}
        actions={[
          {
            icon: <MaterialCommunityIcons name="close" color="white" size={20} />,
            name: "save",
          },
        ]}
        onPressItem={props.onDismiss}
      />
    </Modal>
  );
}
