import { endOfDay, startOfDay } from "date-fns";
import { useState } from "react";
import { InteractionManager } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";

import Icon from "@/components/Icon";
import { useThemeColor } from "@/components/Themed";

export default function HistoryFloatingAction(props: {
  start: number;
  end: number;
  onChange: (start: number, end: number) => void;
}) {
  const { start, end, onChange } = props;
  const [startVisible, setStartVisible] = useState(false);
  const [endVisible, setEndVisible] = useState(false);
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);
  const tintColor = useThemeColor({}, "tint");

  return (
    <>
      <FloatingAction
        color={tintColor}
        overrideWithAction
        actions={[
          {
            icon: <Icon name="calendar" color="white" />,
            name: "calendar",
          },
        ]}
        onPressItem={() => {
          setStartVisible(true);
          Toast.show({
            type: "info",
            text1: "请选择开始日期",
            position: "top",
          });
        }}
      />
      <DateTimePickerModal
        isVisible={startVisible}
        mode="date"
        locale="zh_CN"
        confirmTextIOS="确认开始日期"
        maximumDate={new Date()}
        onConfirm={(val) => {
          setStartDate(startOfDay(val).getTime());
          setStartVisible(false);
          InteractionManager.runAfterInteractions(() => {
            setEndVisible(true);
          });
          Toast.show({
            type: "info",
            text1: "请选择结束日期",
            position: "top",
          });
        }}
        onCancel={() => {
          setStartVisible(false);
        }}
      />
      <DateTimePickerModal
        isVisible={endVisible}
        mode="date"
        locale="zh_CN"
        confirmTextIOS="确认结束日期"
        minimumDate={new Date(startDate)}
        maximumDate={new Date()}
        onConfirm={(val) => {
          setEndDate(endOfDay(val).getTime());
          setEndVisible(false);
          onChange(startDate, endDate);
        }}
        onCancel={() => {
          setEndVisible(false);
        }}
      />
    </>
  );
}
