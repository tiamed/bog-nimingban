import Color from "color";
import { atom, useAtom, useSetAtom } from "jotai";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, InteractionManager, StyleSheet, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

import { UserFavorite } from "../screens/FavoriteScreen/index";
import Icon from "./Icon";

import { SizeContext } from "@/Provider";
import { accurateTimeFormatAtom, favoriteAtom, favoriteTagsAtom } from "@/atoms";
import Modal from "@/components/Modal";
import { View, Button, Text, useThemeColor, TextInput } from "@/components/Themed";
import useHaptics from "@/hooks/useHaptics";
import { formatTime } from "@/utils/format";

export interface Tag {
  id: string;
  name: string;
  createTime: number;
}

const editingTagAtom = atom<Tag>({} as Tag);

export default function TagModal(props: {
  initialValue: string[];
  maxLimit?: number;
  visible: boolean;
  showDefault?: boolean;
  onValueChange: (value: string[]) => void;
  onDismiss: () => void;
  onOpen: () => void;
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const [tags, setTags] = useAtom<Tag[], Tag[], void>(favoriteTagsAtom);
  const [favorite] = useAtom<UserFavorite[]>(favoriteAtom);
  const setEditingTag = useSetAtom(editingTagAtom);

  const close = () => {
    setSelectedValue(props.initialValue);
    props.onDismiss();
  };
  const confirm = () => {
    close();
    props.onValueChange(selectedValue);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setEditingTag({} as Tag);
  };

  const confirmAddModal = (item: Tag) => {
    closeAddModal();
    setTags([...tags.filter((tag) => tag.id !== item.id), item]);
  };

  const toggleItem = (id: string) => {
    if (selectedValue.includes(id)) {
      setSelectedValue(selectedValue.filter((v) => v !== id));
    } else {
      setSelectedValue(
        [id, ...selectedValue].slice(0, props.maxLimit ? props.maxLimit : undefined)
      );
    }
  };

  const confirmDelete = (item: Tag) => {
    if (favorite.find((record) => record.tags?.includes(item.id))) {
      Toast.show({
        type: "error",
        text1: "该标签有关联的收藏，不能删除",
        position: "top",
      });
    } else if (selectedValue.includes(item.id)) {
      Toast.show({
        type: "error",
        text1: "不能删除选中的标签",
        position: "top",
      });
    } else {
      setTags(tags.filter((tag) => tag.id !== item.id));
    }
  };

  const renderLabel = useCallback(
    (item: Tag) => {
      if (item.id) {
        let count;
        if (item.id === "empty") {
          count = favorite?.filter((record) => !record.tags?.length).length;
        } else {
          count = favorite?.filter((record) => record.tags?.includes(item.id))?.length;
        }
        return `${item.name}(${count || 0})`;
      }
      return item.name;
    },
    [favorite]
  );

  const options = useMemo(() => {
    if (props.showDefault) {
      return [{ id: "empty", name: "默认" } as Tag, ...tags];
    }
    return tags;
  }, [tags, props.showDefault]);

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
            data={options}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TagItem
                name={renderLabel(item)}
                time={item.createTime}
                onPress={() => toggleItem(item.id)}
                onEdit={() => {
                  setEditingTag(item);
                  setShowAddModal(true);
                }}
                onDelete={() => {
                  confirmDelete(item);
                }}
                highlight={selectedValue.includes(item.id)}
              />
            )}
            ListHeaderComponent={() => (
              <TagItem
                name="新建标签"
                onPress={() => {
                  setShowAddModal(true);
                }}
              />
            )}
          />
        </View>
        <AddTagModal visible={showAddModal} onConfirm={confirmAddModal} onDismiss={closeAddModal} />
      </Modal>
    </>
  );
}

function AddTagModal(props: {
  visible: boolean;
  onConfirm: (item: Tag) => void;
  onDismiss: () => void;
}) {
  const [input, setInput] = useState("");
  const [current] = useAtom(editingTagAtom);
  const inputRef = useRef<any>(null);
  const backgroundColor = useThemeColor({}, "background");
  const BASE_SIZE = useContext(SizeContext);

  const onConfirm = () => {
    props.onConfirm(current?.id ? { ...current, name: input } : generateTag(input));
    setInput("");
  };

  const onCancel = () => {
    inputRef.current?.blur();
    props.onDismiss();
    setInput("");
  };

  useEffect(() => {
    if (props.visible) {
      InteractionManager.runAfterInteractions(() => {
        inputRef.current?.focus();
      });
    }
  }, [props.visible]);

  useEffect(() => {
    if (current?.name?.length) {
      setInput(current.name);
      InteractionManager.runAfterInteractions(() => {
        inputRef.current?.setNativeProps({
          selection: { start: current.name.length, end: current.name.length },
        });
        global.requestAnimationFrame(() => inputRef.current?.setNativeProps({ selection: null }));
      });
    }
  }, [current]);

  return (
    <Modal
      isVisible={props.visible}
      onBackdropPress={onCancel}
      style={styles.modalWrapper}
      backdropTransitionInTiming={0}
      avoidKeyboard>
      <View style={[styles.modal, { height: 200 }]}>
        <View style={styles.header}>
          <Button title="取消" onPress={onCancel} />
          <Text>{current?.id ? "编辑" : "新建"}收藏标签</Text>
          <Button title="确认" onPress={onConfirm} />
        </View>
        <TextInput
          ref={inputRef}
          style={[styles.input, { backgroundColor, fontSize: BASE_SIZE * 1.2 }]}
          value={input}
          onChangeText={(value) => {
            setInput(value);
          }}
          placeholder="请输入标签名称"
        />
      </View>
    </Modal>
  );
}

function generateTag(name: string) {
  const now = Date.now();
  return {
    id: `${now}-${name}`,
    name,
    createTime: now,
  };
}

function TagItem(props: {
  name: string;
  time?: number;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  highlight?: boolean;
}) {
  const [accurate] = useAtom(accurateTimeFormatAtom);
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "border");
  const inactiveColor = useThemeColor({}, "inactive");
  const textColor = useThemeColor({}, "text");
  const BASE_SIZE = useContext(SizeContext);
  const haptics = useHaptics();
  const subColor = useMemo(() => {
    return props.highlight ? Color(tintColor).alpha(0.5).toString() : inactiveColor;
  }, [props.highlight, tintColor]);
  return (
    <TouchableOpacity
      onPress={() => {
        haptics.light();
        props.onPress();
      }}
      style={[styles.item, { borderColor: props.highlight ? tintColor : borderColor }]}>
      <View style={styles.itemBody}>
        <Text style={[styles.itemLabel, { color: props.highlight ? tintColor : textColor }]}>
          {props.name}
        </Text>
        <View style={[styles.itemContent]}>
          {props.time && (
            <>
              <Icon name="history" color={subColor} size={BASE_SIZE * 0.8} />
              <Text
                style={{
                  color: subColor,
                  fontSize: BASE_SIZE * 0.8,
                }}>
                {formatTime(props.time, accurate)}
              </Text>
            </>
          )}
        </View>
      </View>
      {props.time && (
        <View style={styles.itemActionWrapper}>
          <TouchableOpacity style={styles.itemAction} onPress={props.onEdit}>
            <Icon name="edit" color={tintColor} size={BASE_SIZE * 1.4} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemAction} onPress={props.onDelete}>
            <Icon name="minus-circle" color={tintColor} size={BASE_SIZE * 1.4} />
          </TouchableOpacity>
        </View>
      )}
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
  itemLabel: {
    paddingHorizontal: 80,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemActionWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    position: "absolute",
    right: 0,
  },
  itemAction: {
    padding: 10,
  },
  input: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
});
