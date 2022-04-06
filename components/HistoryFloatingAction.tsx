import { useState } from "react";
import { FloatingAction } from "react-native-floating-action";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Icon from "@/components/Icon";
import { useThemeColor } from "@/components/Themed";

export default function HistoryFloatingAction() {
  const [visible, setVisible] = useState(false);
  const tintColor = useThemeColor({}, "tint");
  return (
    <>
      <FloatingAction
        color={tintColor}
        overrideWithAction
        actions={[
          {
            icon: <Icon name="search" color="white" />,
            name: "search",
          },
        ]}
        onPressItem={() => {
          setVisible(true);
        }}
      />
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
