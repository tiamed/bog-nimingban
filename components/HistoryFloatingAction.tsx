import { useState } from "react";
import { StyleSheet } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { useThemeColor, View } from "../components/Themed";
import Icon from "../components/Icon";

export default function HistoryFloatingAction() {
  const [visible, setVisible] = useState(false);
  const tintColor = useThemeColor({}, "tint");
  return (
    <>
      <FloatingAction
        color={tintColor}
        overrideWithAction={true}
        actions={[
          {
            icon: <Icon name="search" color="white" />,
            name: "search",
          },
        ]}
        onPressItem={() => {
          setVisible(true);
        }}
      ></FloatingAction>
      {/* <Modal
        isVisible={visible}
        onBackdropPress={close}
        backdropOpacity={0.3}
        backdropTransitionOutTiming={0}
      >
        <View></View>
      </Modal> */}
      <DateTimePickerModal
        isVisible={visible}
        mode="date"
        onConfirm={() => {
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  );
}
