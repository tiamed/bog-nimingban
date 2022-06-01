import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import WebView from "react-native-webview";

import Modal from "@/components/Modal";
import { useThemeColor } from "@/components/Themed";

export default function LongImageModal(props: {
  visible: boolean;
  uri: string;
  onDismiss: () => void;
}) {
  const [show, setShow] = useState(false);
  const tintColor = useThemeColor({}, "tint");
  const INJECTED_JAVASCRIPT =
    Platform.OS === "ios"
      ? `
  setTimeout(() => {
    document.body.style.display = 'flex';
    document.body.style.backgroundColor = 'black';
  }, 0)
  `
      : "";

  useEffect(() => {
    if (!props.visible) {
      setShow(false);
    }
  }, [props.visible]);

  return (
    <Modal isVisible={props.visible} onBackdropPress={props.onDismiss} style={styles.modal}>
      <WebView
        source={{ uri: props.uri }}
        containerStyle={styles.container}
        style={{ display: show ? "flex" : "none", backgroundColor: "transparent" }}
        injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT}
        startInLoadingState={false}
        onLoad={() => setShow(true)}
      />
      {!show && (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator color={tintColor} size="large" />
        </View>
      )}
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

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
    position: "relative",
  },
  container: {
    backgroundColor: "black",
  },
  indicatorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
