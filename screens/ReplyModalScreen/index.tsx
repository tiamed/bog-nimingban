import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useAtom, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  InteractionManager,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import EmoticonPicker from "./EmoticonPicker";
import Footer from "./Footer";

import { addReply, uploadImage, Image, getReply } from "@/api";
import {
  cookiesAtom,
  draftAtom,
  postIdRefreshingAtom,
  replyHistoryAtom,
  selectedCookieAtom,
} from "@/atoms";
import Icon from "@/components/Icon";
import Overlay from "@/components/Overlay";
import ImageView from "@/components/Post/ImageView";
import { Button, Text, useThemeColor, View, TextInput } from "@/components/Themed";
import Errors from "@/constants/Errors";
import useForums, { useForumsIdMap } from "@/hooks/useForums";
import { ReplyHistory } from "@/screens/ReplyHistoryScreen";
import { RootStackScreenProps } from "@/types";

export default function ReplyModalScreen({
  route,
  navigation,
}: RootStackScreenProps<"ReplyModal">) {
  const insets = useSafeAreaInsets();

  const [forumId, setForumId] = useState<number | null | undefined>(null);
  const [replyId, setReplyId] = useState<number | null | undefined>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [emoticonPickerVisible, setEmoticonPickerVisible] = useState(false);

  const [cookies] = useAtom(cookiesAtom);
  const [draft, setDraft] = useAtom(draftAtom);
  const [cookieCode, setCookieCode] = useAtom(selectedCookieAtom);
  const [replyHistory, setReplyHistory] = useAtom<ReplyHistory[], ReplyHistory[], void>(
    replyHistoryAtom
  );
  const setPostIdRefreshing = useSetAtom(postIdRefreshingAtom);

  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const forums = useForums();
  const forumsIdMap = useForumsIdMap();
  const inputRef = React.useRef<any>(null);
  const close = () => {
    navigation.goBack();
  };

  const addDice = () => {
    insertDraft("[0-9]");
  };

  const addEmoji = () => {
    Keyboard.dismiss();
    setEmoticonPickerVisible(!emoticonPickerVisible);
  };

  const insertDraft = (str: string) => {
    setDraft([draft.slice(0, selection.start), str, draft.slice(selection.end)].join(""));
    if (Platform.OS === "ios") {
      inputRef.current.blur();
    }
    const targetPosition = selection.start + str.length;
    setSelection({
      start: targetPosition,
      end: targetPosition,
    });
    InteractionManager.runAfterInteractions(() => {
      inputRef.current?.setNativeProps({
        selection: { start: targetPosition, end: targetPosition },
      });
      global.requestAnimationFrame(() => inputRef.current?.setNativeProps({ selection: null }));
    });

    if (inputRef.current?.setSelectionRange) {
      inputRef.current.setSelectionRange(targetPosition, targetPosition);
    }
  };

  const addImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      try {
        const { uri } = result;
        const formData = new FormData();
        const fileName = uri.split("/")[uri.split("/").length - 1];
        const ext = uri.split(".")[uri.split(".").length - 1];
        formData.append("image", {
          uri,
          name: fileName,
          type: `image/${ext}`,
        } as any);
        const { code, pic, msg } = await uploadImage(formData);
        if (code === 200) {
          if (images.find((image) => image.url === pic)) {
            Toast.show({ type: "success", text1: "请勿上传重复图片" });
          } else {
            setImages([...images, { url: pic, ext: `.${ext}` }]);
          }
        } else {
          Toast.show({ type: "error", text1: msg });
        }
      } catch (error) {
        Toast.show({ type: "error", text1: (error as Error).message });
      }
    }
  };

  const submit = async () => {
    const params = {
      comment: draft,
      forum: forumId || 1,
      res: replyId || 0,
      title: "",
      name: "",
      cookie: cookieCode,
      webapp: 1,
      img: images.map((image) => image.url),
    };
    const {
      data: { info: newPostId, type, code },
    } = await addReply(params);
    if (/ok/i.test(type)) {
      if (typeof newPostId === "number") {
        Toast.show({ type: "success", text1: "发送成功" });
        const {
          data: { info },
        } = await getReply(newPostId);
        if (info?.id) {
          setReplyHistory([
            {
              ...info,
              createTime: Date.now(),
            },
            ...replyHistory,
          ]);
        }
      }
      if (!replyId) {
        navigation.push("Post", {
          id: newPostId,
          title: `${forumsIdMap.get(params.forum)} Po.${newPostId}`,
        });
      } else {
        setPostIdRefreshing(replyId);
      }
      setDraft("");
      close();
    } else {
      Toast.show({
        type: "error",
        text1: Errors[code] || newPostId?.toString() || "出错了",
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setForumId(route.params.forumId);
      setReplyId(route.params.postId);
      insertDraft(route.params.content || "");
    }, 100);
  }, [route.params]);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => {
      setEmoticonPickerVisible(false);
    });
  }, []);

  useEffect(() => {
    if (!cookieCode && cookies?.filter((cookie: any) => cookie.id)?.length) {
      setCookieCode(cookies[0]?.code);
    }
  }, [cookieCode]);

  return (
    <View style={styles.modal}>
      <Overlay />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          ...styles.container,
          backgroundColor,
        }}>
        <View style={styles.header}>
          <Text>{replyId ? `回复 >${replyId}` : "发布新串 >"}</Text>
          <Button title="关闭" onPress={close} />
        </View>
        <TextInput
          ref={inputRef}
          multiline
          scrollEnabled
          textAlignVertical="top"
          selectionColor={tintColor}
          style={styles.input}
          value={draft}
          onSelectionChange={(event) => {
            setSelection(event.nativeEvent.selection);
          }}
          showSoftInputOnFocus={showKeyboard}
          onChangeText={(val) => setDraft(val)}
        />
        <View style={styles.pickerWrapper}>
          {!replyId && (
            <Picker
              style={{
                ...styles.picker,
                color: tintColor,
                backgroundColor,
              }}
              itemStyle={{
                color: tintColor,
              }}
              selectedValue={forumId as number}
              onValueChange={(val: number) => {
                if (val !== forumId) {
                  setForumId(val);
                }
              }}>
              {forums
                ?.filter((x) => x.id && !x.hide)
                ?.map((forum: any) => (
                  <Picker.Item key={forum.id} label={forum.name} value={forum.id} />
                ))}
            </Picker>
          )}
          {cookies?.length ? (
            <Picker
              style={{
                ...styles.picker,
                color: tintColor,
                backgroundColor,
              }}
              itemStyle={{
                color: tintColor,
              }}
              selectedValue={cookieCode}
              onValueChange={(val: string) => setCookieCode(val)}>
              {cookies
                ?.filter((cookie: any) => cookie.id)
                ?.map((cookie: any) => (
                  <Picker.Item
                    key={cookie.id}
                    label={`${cookie.master ? "影" : "主"}·${cookie.name}`}
                    value={cookie.code}
                  />
                ))}
            </Picker>
          ) : (
            <Text style={{ ...styles.picker, padding: 10 }}>没有可用的饼干</Text>
          )}
        </View>
        <View style={{ flexDirection: "row", marginBottom: 10, flexWrap: "wrap" }}>
          {images.map((image) => (
            <View key={image.url} style={styles.imageList}>
              <ImageView
                data={image}
                onPress={() => {}}
                style={{
                  borderColor: tintColor,
                  ...styles.imageWrapper,
                }}
                imageStyle={styles.image}
                path="image_pre"
              />
              <TouchableOpacity
                onPress={() => {
                  setImages(images.filter((item) => item !== image));
                }}>
                <Icon name="times-circle" color={tintColor} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={{ ...styles.footerWrapper, paddingBottom: insets.bottom }}>
          <Footer
            items={[
              {
                icon: showKeyboard ? "caret-down" : "caret-up",
                onPress: () => {
                  if (showKeyboard) {
                    Keyboard.dismiss();
                  } else {
                    setTimeout(() => {
                      inputRef.current?.blur();
                      inputRef.current?.focus();
                    }, 300);
                  }
                  setShowKeyboard(!showKeyboard);
                },
              },
              {
                icon: "question-circle",
                onPress: () => {
                  const current = forums.find((x) => x.id === forumId);
                  Toast.show({ type: "info", text1: current?.info });
                },
              },
              { icon: "smile-o", onPress: addEmoji },
              { icon: "image", onPress: addImage },
              { icon: "dot-circle-o", onPress: addDice },
              { icon: "send", onPress: submit },
            ]}
          />
        </View>
        <EmoticonPicker
          visible={emoticonPickerVisible}
          onInsert={(emoji) => {
            insertDraft(emoji);
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#40404040",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.3)",
    flex: 1,
  },
  container: {
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  input: {
    minHeight: 120,
    maxHeight: 240,
    width: "100%",
    padding: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  pickerWrapper: {
    flexDirection: "row",
    minHeight: 60,
    alignItems: "center",
    flex: 1,
  },
  picker: {
    flex: 1,
  },
  imageList: {
    width: "25%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  imageWrapper: {
    aspectRatio: 1,
    borderWidth: 1,
    marginRight: 5,
    width: "60%",
    height: "60%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  footerWrapper: {
    marginLeft: -10,
    marginRight: -10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
  },
});
