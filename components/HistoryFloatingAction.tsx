import { endOfDay, startOfDay, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Icon from "@/components/Icon";
import ListSearchBar from "@/components/ListSearchBar";
import Modal from "@/components/Modal";
import { Button, Text, useThemeColor, View } from "@/components/Themed";
import useHaptics from "@/hooks/useHaptics";
import {
  formatHistoryDate,
  HistoryRange,
  HistoryRangePreset,
  historyRangePresets,
} from "@/utils/historyRange";

export default function HistoryFloatingAction(props: {
  range: HistoryRange;
  query: string;
  searchPlaceholder?: string;
  onChange: (range: HistoryRange, query: string) => void;
}) {
  const { range, query, searchPlaceholder, onChange } = props;
  const [visible, setVisible] = useState(false);
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
        onPressItem={() => setVisible(true)}
      />
      <HistoryRangeModal
        visible={visible}
        range={range}
        query={query}
        searchPlaceholder={searchPlaceholder}
        onDismiss={() => setVisible(false)}
        onChange={(value, nextQuery) => {
          setVisible(false);
          onChange(value, nextQuery);
        }}
      />
    </>
  );
}

function HistoryRangeModal(props: {
  visible: boolean;
  range: HistoryRange;
  query: string;
  searchPlaceholder?: string;
  onChange: (range: HistoryRange, query: string) => void;
  onDismiss: () => void;
}) {
  const { visible, range, query, searchPlaceholder, onChange, onDismiss } = props;
  const [draftQuery, setDraftQuery] = useState("");
  const [customStart, setCustomStart] = useState(0);
  const [customEnd, setCustomEnd] = useState(0);
  const [pickerTarget, setPickerTarget] = useState<"start" | "end" | null>(null);
  const borderColor = useThemeColor({}, "border");
  const tintColor = useThemeColor({}, "tint");
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();

  useEffect(() => {
    if (visible) {
      const now = Date.now();
      setCustomStart(
        range.preset === "custom" && range.start ? range.start : subDays(now, 6).getTime()
      );
      setCustomEnd(range.preset === "custom" && range.end ? range.end : now);
      setDraftQuery(query);
    }
  }, [visible, range, query]);

  const selectPreset = (preset: Exclude<HistoryRangePreset, "custom">) => {
    haptics.light();
    onChange({ preset }, draftQuery);
  };

  const applyCustom = () => {
    haptics.light();
    onChange(
      {
        preset: "custom",
        start: startOfDay(customStart).getTime(),
        end: endOfDay(customEnd).getTime(),
      },
      draftQuery
    );
  };

  const confirm = () => onChange(range, draftQuery);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onDismiss}
      style={styles.modalWrapper}
      avoidKeyboard>
      <View style={[styles.modal, { paddingBottom: 20 + insets.bottom }]}>
        <View style={styles.header}>
          <Button title="取消" onPress={onDismiss} />
          <Text style={styles.title}>筛选</Text>
          <Button title="确认" onPress={confirm} />
        </View>
        <ListSearchBar
          style={styles.search}
          value={draftQuery}
          onChangeText={setDraftQuery}
          onSubmitEditing={confirm}
          placeholder={searchPlaceholder}
        />
        <Text style={styles.sectionTitle} lightColor="#666666" darkColor="#999999">
          日期范围
        </Text>
        <View style={styles.presets}>
          {historyRangePresets.map(({ preset, label }) => {
            const active = range.preset === preset;
            return (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.preset,
                  { borderColor: active ? tintColor : borderColor },
                  active && { backgroundColor: tintColor },
                ]}
                onPress={() => selectPreset(preset)}>
                <Text style={active ? styles.activeText : undefined}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.sectionTitle} lightColor="#666666" darkColor="#999999">
          自定义范围
        </Text>
        <View style={styles.customRow}>
          <DateField
            label="开始"
            value={customStart}
            active={range.preset === "custom"}
            onPress={() => setPickerTarget("start")}
          />
          <Text style={styles.separator}>至</Text>
          <DateField
            label="结束"
            value={customEnd}
            active={range.preset === "custom"}
            onPress={() => setPickerTarget("end")}
          />
        </View>
        <TouchableOpacity
          style={[styles.applyButton, { backgroundColor: tintColor }]}
          onPress={applyCustom}>
          <Text style={styles.activeText}>应用自定义范围</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={pickerTarget !== null}
          mode="date"
          locale="zh_CN"
          confirmTextIOS="确认"
          cancelTextIOS="取消"
          date={new Date(pickerTarget === "end" ? customEnd : customStart)}
          minimumDate={pickerTarget === "end" ? startOfDay(customStart) : undefined}
          maximumDate={pickerTarget === "start" ? new Date(customEnd) : new Date()}
          onConfirm={(val) => {
            if (pickerTarget === "start") {
              setCustomStart(val.getTime());
            } else {
              setCustomEnd(val.getTime());
            }
            setPickerTarget(null);
          }}
          onCancel={() => setPickerTarget(null)}
        />
      </View>
    </Modal>
  );
}

function DateField(props: { label: string; value: number; active: boolean; onPress: () => void }) {
  const borderColor = useThemeColor({}, "border");
  const tintColor = useThemeColor({}, "tint");
  return (
    <TouchableOpacity
      style={[styles.dateField, { borderColor: props.active ? tintColor : borderColor }]}
      onPress={props.onPress}>
      <Text style={styles.dateLabel} lightColor="#666666" darkColor="#999999">
        {props.label}
      </Text>
      <Text>{props.value ? formatHistoryDate(props.value) : "-"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modal: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
  },
  search: {
    marginBottom: 16,
  },
  presets: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
    marginBottom: 16,
  },
  preset: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
  activeText: {
    color: "white",
  },
  sectionTitle: {
    marginBottom: 8,
  },
  customRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  separator: {
    marginHorizontal: 10,
  },
  dateField: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  dateLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  applyButton: {
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
});
