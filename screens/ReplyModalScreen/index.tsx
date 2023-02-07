import * as ImagePicker from "expo-image-picker";
import { atom, useAtom, useSetAtom } from "jotai";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  InteractionManager,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDebouncedCallback } from "use-debounce/lib";

import EmoticonPicker from "./EmoticonPicker";
import Footer from "./Footer";

import { SizeContext } from "@/Provider";
import { addReply, uploadImage, Image, getReply } from "@/api";
import {
  autoSavedDraftAtom,
  canRecoverDraftAtom,
  cookiesAtom,
  draftAtom,
  fullscreenInputAtom,
  postIdRefreshingAtom,
  replyHistoryAtom,
  selectedCookieAtom,
  sketchUriAtom,
} from "@/atoms";
import Icon from "@/components/Icon";
import Overlay from "@/components/Overlay";
import Picker from "@/components/Picker";
import ImageView from "@/components/Post/ImageView";
import { Text, useThemeColor, View, TextInput } from "@/components/Themed";
import Errors from "@/constants/Errors";
import Layout from "@/constants/Layout";
import useForums from "@/hooks/useForums";
import { ReplyHistory } from "@/screens/ReplyHistoryScreen";
import { RootStackScreenProps } from "@/types";

const showPrefixInputAtom = atom(false);

export default function ReplyModalScreen({
  route,
  navigation,
}: RootStackScreenProps<"ReplyModal">) {
  const insets = useSafeAreaInsets();

  const [forumId, setForumId] = useState<number | null | undefined>(null);
  const [replyId, setReplyId] = useState<number | null | undefined>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showEmoticonPicker, setShowEmoticonPicker] = useState(false);

  const [showPrefixInput] = useAtom(showPrefixInputAtom);
  const [cookies] = useAtom(cookiesAtom);
  const [draft, setDraft] = useAtom(draftAtom);
  const [autoSavedDraft, setAutoSavedDraft] = useAtom(autoSavedDraftAtom);
  const [canRecoverDraft, setCanRecoverDraft] = useAtom(canRecoverDraftAtom);
  const [cookieCode, setCookieCode] = useAtom(selectedCookieAtom);
  const [replyHistory, setReplyHistory] = useAtom<ReplyHistory[], ReplyHistory[], void>(
    replyHistoryAtom
  );
  const [fullscreenInput] = useAtom(fullscreenInputAtom);
  const [sketchUri, setSketchUri] = useAtom(sketchUriAtom);
  const setPostIdRefreshing = useSetAtom(postIdRefreshingAtom);

  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const forums = useForums();
  const BASE_SIZE = useContext(SizeContext);
  const inputRef = useRef<any>(null);
  const selectionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  const close = () => {
    navigation.goBack();
  };

  const addDice = () => {
    insertDraft("[0-9]");
  };

  const addEmoji = () => {
    if (!fullscreenInput) {
      Keyboard.dismiss();
    }
    setShowEmoticonPicker(!showEmoticonPicker);
  };

  const insertDraft = useCallback(
    (str: string, isAppend: boolean = false) => {
      if (isAppend) {
        setDraft((draft) => [draft, str].join(""));
      } else {
        setDraft((draft) =>
          [
            draft.slice(0, selectionRef.current.start),
            str,
            draft.slice(selectionRef.current.end),
          ].join("")
        );
      }
      if (Platform.OS === "android") {
        const targetPosition = selectionRef.current.start + str.length;
        selectionRef.current = { start: targetPosition, end: targetPosition };
        InteractionManager.runAfterInteractions(() => {
          inputRef.current?.setNativeProps({
            selection: { start: targetPosition, end: targetPosition },
          });
          global.requestAnimationFrame(() => inputRef.current?.setNativeProps({ selection: null }));
        });

        if (inputRef.current?.setSelectionRange) {
          inputRef.current.setSelectionRange(targetPosition, targetPosition);
        }
      }
    },
    [setDraft]
  );

  const upload = async (uri: string) => {
    try {
      Toast.show({
        type: "info",
        text1: "图片上传中",
        position: "top",
        autoHide: false,
      });
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
          Toast.show({ type: "success", text1: "请勿上传重复图片", position: "top" });
        } else {
          setImages([...images, { url: pic, ext: `.${ext}` }]);
        }
      } else {
        Toast.show({ type: "error", text1: msg, position: "top" });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: (error as Error).message, position: "top" });
    } finally {
      Toast.hide();
    }
  };

  const addImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled && result.uri) {
      await upload(result.uri);
    }
  };

  const submit = async () => {
    const params = {
      comment: draft,
      forum: forumId || 1,
      res: replyId || 0,
      title,
      name,
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
          setAutoSavedDraft("");
        }
      }
      if (!replyId && newPostId) {
        close();
        setTimeout(() => {
          navigation.push("Post", {
            id: newPostId,
            title: `Po.${newPostId}`,
          });
        }, 500);
      } else {
        setPostIdRefreshing(replyId!);
      }
      setDraft("");
      selectionRef.current = { start: 0, end: 0 };
      close();
    } else {
      Toast.show({
        type: "error",
        text1: Errors[code] || newPostId?.toString() || "出错了",
      });
    }
  };

  useEffect(() => {
    if (route.params.content) {
      if (draft.endsWith("\n") || draft.length === 0) {
        insertDraft(route.params.content, true);
      } else {
        insertDraft("\n" + route.params.content, true);
      }
    }
    setForumId(route.params.forumId);
    setReplyId(route.params.postId);
  }, [route.params]);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => {
      setShowEmoticonPicker(false);
    });
    return () => Keyboard.removeAllListeners("keyboardDidShow");
  }, []);

  useEffect(() => {
    if (!fullscreenInput && showEmoticonPicker) {
      Keyboard.dismiss();
    }
  }, [fullscreenInput]);

  useEffect(() => {
    if (sketchUri) {
      upload(sketchUri).then(() => {
        setSketchUri("");
      });
    }
  }, [sketchUri]);

  useEffect(() => {
    if (draft) {
      setAutoSavedDraft(draft);
    }
  }, [draft]);

  useEffect(() => {
    if (autoSavedDraft && !draft && canRecoverDraft) {
      Alert.alert("提示", "检测到有未保存的草稿，是否要恢复？", [
        { text: "取消", onPress: () => setAutoSavedDraft("") },
        {
          text: "恢复",
          onPress: () => {
            insertDraft(autoSavedDraft);
            setAutoSavedDraft("");
          },
        },
      ]);
      setCanRecoverDraft(false);
    }
  }, [draft, autoSavedDraft]);

  return (
    <View style={styles.modal}>
      <Overlay />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          ...styles.container,
          backgroundColor,
          marginTop: insets.top,
          flex: fullscreenInput ? 1 : undefined,
        }}>
        <Header replyId={replyId} forumId={forumId} onClose={close} />
        {showPrefixInput && (
          <>
            <TextInput
              value={name}
              selectionColor={tintColor}
              onChangeText={setName}
              placeholder="昵称"
              style={[styles.inputPrefix, { height: BASE_SIZE * 1.8 }]}
            />
            <TextInput
              value={title}
              selectionColor={tintColor}
              onChangeText={setTitle}
              placeholder="标题"
              style={[styles.inputPrefix, { height: BASE_SIZE * 1.8 }]}
            />
          </>
        )}
        <TextInput
          ref={inputRef}
          multiline
          scrollEnabled
          textAlignVertical="top"
          selectionColor={tintColor}
          style={[
            styles.input,
            {
              flex: fullscreenInput ? 1 : undefined,
              minHeight: fullscreenInput ? undefined : 120,
              maxHeight: fullscreenInput ? undefined : 240,
            },
          ]}
          value={draft}
          onSelectionChange={(event) => {
            selectionRef.current = event.nativeEvent.selection;
          }}
          showSoftInputOnFocus={showKeyboard}
          onChangeText={setDraft}
          autoCorrect={false}
        />
        <View style={styles.pickerWrapper}>
          {!replyId && (
            <Picker
              selectedValue={forumId as number}
              onValueChange={(val: number) => {
                if (val !== forumId) {
                  setForumId(val);
                }
              }}
              options={forums
                ?.filter((x) => x.id && !x.hide)
                ?.map((forum: any) => ({ label: forum.name, value: forum.id }))}
            />
          )}
          <Picker
            selectedValue={cookieCode}
            onValueChange={(val: string) => setCookieCode(val)}
            placeholder="请选择饼干"
            emptyText="没有可用的饼干"
            options={[
              ...cookies
                ?.filter((cookie: any) => cookie.id)
                ?.map((cookie: any) => ({
                  key: cookie.id,
                  label: `${cookie.master ? "影" : "主"}·${cookie.name}`,
                  value: cookie.code,
                })),
            ]}
          />
        </View>
        {images.length > 0 && (
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
        )}
        <View style={{ paddingBottom: insets.bottom }}>
          <View style={{ ...styles.footerWrapper }}>
            <Footer
              items={[
                {
                  icon: showKeyboard ? "chevron-down" : "chevron-up",
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
                  icon: "paintbrush",
                  onPress: () => {
                    navigation.navigate("Sketch");
                  },
                },
                { icon: "smiley", onPress: addEmoji },
                { icon: "image", onPress: addImage },
                {
                  icon: "roll",
                  family: "BogIcons",
                  onPress: useDebouncedCallback(addDice, 500, { leading: true, trailing: false }),
                },
                {
                  icon: "paper-airplane",
                  onPress: useDebouncedCallback(submit, 1000, { leading: true, trailing: false }),
                  inverted: true,
                },
              ]}
            />
          </View>
          {showEmoticonPicker && <EmoticonPicker onInsert={insertDraft} />}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Header(props: {
  replyId: number | null | undefined;
  forumId: number | null | undefined;
  onClose: () => void;
}) {
  const [fullscreenInput, setFullscreenInput] = useAtom(fullscreenInputAtom);
  const [showPrefixInput, setShowPrefixInput] = useAtom(showPrefixInputAtom);
  const BASE_SIZE = useContext(SizeContext);
  const tintBackgroundColor = useThemeColor({}, "tintBackground");
  const tintColor = useThemeColor({}, "tint");
  const forums = useForums();

  return (
    <View style={styles.header}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}>
        <TouchableOpacity
          hitSlop={{ left: 5, right: 100, top: 5, bottom: 5 }}
          onPress={() => setShowPrefixInput(!showPrefixInput)}
          style={{
            marginRight: BASE_SIZE * 0.2,
            paddingHorizontal: BASE_SIZE * 0.8,
            backgroundColor: tintBackgroundColor,
            borderRadius: BASE_SIZE,
          }}>
          <Icon
            family="Octicons"
            name={showPrefixInput ? "triangle-down" : "triangle-up"}
            color={tintColor}
          />
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold" }}>
          {props.replyId ? `回复 Po.${props.replyId}` : "发布新串"}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{ marginRight: 20 }}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          onPress={() => {
            const current = forums.find((x) => x.id === props.forumId);
            Toast.show({ type: "info", text1: current?.info });
          }}>
          <Icon name="question" family="Octicons" color={tintColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginRight: 20 }}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          onPress={() => {
            setFullscreenInput(!fullscreenInput);
          }}>
          <Icon name="screen-full" family="Octicons" color={tintColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginRight: 10 }}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          onPress={props.onClose}>
          <Icon name="x" family="Octicons" color={tintColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 0,
    alignItems: "center",
    backgroundColor: "#40404040",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.3)",
    flex: 1,
  },
  container: {
    justifyContent: "center",
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
    paddingHorizontal: Layout.replyEditorHorizontalPadding,
    paddingVertical: Layout.replyEditorVerticalPadding,
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
    overflow: "hidden",
  },
  inputPrefix: {
    marginBottom: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
    overflow: "hidden",
  },
  pickerWrapper: {
    flexDirection: "row",
    minHeight: 50,
    alignItems: "center",
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
    marginHorizontal: -Layout.replyEditorHorizontalPadding,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
  },
});
