import { endOfDay, startOfDay } from "date-fns";
import { useState } from "react";
import { InteractionManager, Platform } from "react-native";
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
          if (Platform.OS === "ios") {
            InteractionManager.runAfterInteractions(() => {
              setEndVisible(true);
            });
          } else {
            setEndVisible(true);
          }
          Toast.show({
            type: "info",
            text1: "请选择结束日期",
            position: "top",
          });
        }}
        onCancel={() => {
          setStartVisible(false);
          Toast.show({
            type: "info",
            text1: "已取消过滤",
            position: "top",
            visibilityTime: 500,
          });
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
          Toast.show({
            type: "success",
            text1: "已过滤历史记录",
            position: "top",
            visibilityTime: 500,
          });
        }}
        onCancel={() => {
          setEndVisible(false);
          Toast.show({
            type: "info",
            text1: "已取消过滤",
            position: "top",
            visibilityTime: 500,
          });
        }}
      />
    </>
  );
}
