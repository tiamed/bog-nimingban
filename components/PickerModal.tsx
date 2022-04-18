import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";

import Modal from "./Modal";

import { View, Button, Text, useThemeColor } from "@/components/Themed";

interface Option {
  label: string;
  value: string | number;
}

export default function PickerModal(props: {
  initialValue: string[];
  maxLimit?: number;
  visible: boolean;
  options: Option[];
  onValueChange: (value: (string | number)[]) => void;
  onDismiss: () => void;
}) {
  const [selectedValue, setSelectedValue] = useState<(string | number)[]>([]);

  const close = () => {
    props.onDismiss();
    setSelectedValue(props.initialValue);
  };
  const confirm = () => {
    close();
    props.onValueChange(selectedValue);
  };

  const toggleItem = (value: string | number) => {
    if (selectedValue.includes(value)) {
      setSelectedValue(selectedValue.filter((v) => v !== value));
    } else {
      setSelectedValue(
        [value, ...selectedValue].slice(0, props.maxLimit ? props.maxLimit : undefined)
      );
    }
  };

  const keyExtractor = (item: Option) => item.value.toString();

  const renderItem = ({ item }: { item: Option }) => (
    <OptionItem
      name={item.label}
      onPress={() => toggleItem(item.value)}
      highlight={selectedValue.includes(item.value)}
    />
  );

  const renderHeader = () =>
    props.maxLimit ? null : (
      <OptionItem
        name="全选"
        onPress={() => {
          if (selectedValue.length !== props.options.length) {
            setSelectedValue(props.options.map((option) => option.value));
          } else {
            setSelectedValue([]);
          }
        }}
      />
    );

  useEffect(() => {
    setSelectedValue(props.initialValue);
  }, [props.initialValue]);

  return (
    <>
      <Modal isVisible={props.visible} onBackdropPress={close} style={styles.modalWrapper}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Button title="取消" onPress={close} />
            <Button title="确认" onPress={confirm} />
          </View>
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.contentContainer}
            numColumns={1}
            data={props.options}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
          />
        </View>
      </Modal>
    </>
  );
}

function OptionItem(props: { name: string; highlight?: boolean; onPress: () => void }) {
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "border");
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPress();
      }}
      style={[styles.item, { borderColor: props.highlight ? tintColor : borderColor }]}>
      <View style={styles.itemBody}>
        <Text>{props.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modal: {
    flexDirection: "column",
    justifyContent: "flex-start",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
    paddingVertical: 20,
    paddingHorizontal: 10,
    height: "46%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  list: {
    overflow: "scroll",
  },
  contentContainer: {
    height: "auto",
  },
  item: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    margin: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  itemBody: {
    flexDirection: "column",
    alignItems: "center",
  },
});
