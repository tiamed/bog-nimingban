import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useKeyboard } from "@react-native-community/hooks";

import { Button, Text, useThemeColor, View } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cookiesAtom, draftAtom } from "../atoms";
import TabBarIcon from "../components/TabBarIcon";
import useForums, { useForumsIdMap } from "../hooks/useForums";
import { addReply, Image } from "../api";
import Toast from "react-native-root-toast";
import { TextInput } from "react-native";

import useEmoticons from "../hooks/useEmoticons";
import Overlay from "../components/Overlay";

export default function ReplyModalScreen({
  route,
  navigation,
}: RootStackScreenProps<"ReplyModal">) {
  const insets = useSafeAreaInsets();

  const [forumId, setForumId] = useState<number | null | undefined>(null);
  const [replyId, setReplyId] = useState<number | null | undefined>(null);
  const [cookieCode, setCookieCode] = useState("");
  const [images] = useState<Image[]>([]);
  const [emoticonPickerVisible, setEmoticonPickerVisible] = useState(false);
  const [cookies] = useAtom(cookiesAtom);
  const [draft, setDraft] = useAtom(draftAtom);
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const forums = useForums();
  const forumsIdMap = useForumsIdMap();
  const close = () => {
    navigation.goBack();
  };

  const addDice = () => {
    setDraft(draft + "[0-9]");
  };

  const addEmoji = () => {
    Keyboard.dismiss();
    setEmoticonPickerVisible(!emoticonPickerVisible);
  };

  const addImage = () => {
    Toast.show("开发中");
  };

  const submit = async () => {
    if (forumId && cookieCode) {
      const params = {
        comment: draft,
        forum: forumId || 1,
        res: replyId || 0,
        title: "",
        name: "",
        cookie: cookieCode,
        webapp: 1,
        img: images,
      };
      const {
        data: { info: newPostId },
      } = await addReply(params);
      if (!replyId) {
        navigation.navigate("Post", {
          id: newPostId,
          title: `${forumsIdMap.get(params.forum)} Po.${newPostId}`,
        });
      }
      if (typeof newPostId === "number") {
        Toast.show("发送成功");
      }
      close();
      return;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setForumId(route.params.forumId);
      setReplyId(route.params.postId);
      setDraft(draft + (route.params.content || ""));
    }, 100);
  }, [route.params]);

  useEffect(() => {
    if (cookies?.length) setCookieCode(cookies[0].code);
  }, [cookies]);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => {
      setEmoticonPickerVisible(false);
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#40404040",
      }}
    >
      <Overlay></Overlay>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          ...styles.container,
          backgroundColor,
        }}
      >
        <View style={styles.header}>
          <Text>{replyId ? `回复 >${replyId}` : "发布新串 >"}</Text>
          <Button title="关闭" onPress={close}></Button>
        </View>
        <TextInput
          multiline
          scrollEnabled
          textAlignVertical="top"
          selectionColor={tintColor}
          style={styles.input}
          value={draft}
          onChangeText={(val) => setDraft(val)}
        ></TextInput>
        <View style={{ flexDirection: "row" }}>
          {!replyId && <ForumPicker />}
          {cookies?.length ? (
            <Picker
              style={{
                ...styles.picker,
                color: tintColor,
                backgroundColor: backgroundColor,
              }}
              selectedValue={cookieCode}
              onValueChange={(val: string) => setCookieCode(val)}
            >
              {cookies?.map((cookie: any) => (
                <Picker.Item
                  key={cookie.hash}
                  label={cookie.name}
                  value={cookie.code}
                ></Picker.Item>
              ))}
            </Picker>
          ) : (
            <Text style={{ ...styles.picker, padding: 10 }}>
              没有可用的饼干
            </Text>
          )}
        </View>
        <Footer></Footer>
        <EmoticonPicker
          visible={emoticonPickerVisible}
          onInsert={(emoji) => {
            setDraft(draft + emoji);
          }}
        ></EmoticonPicker>
      </KeyboardAvoidingView>
    </View>
  );

  function ForumPicker() {
    return (
      <Picker
        style={{
          ...styles.picker,
          color: tintColor,
          backgroundColor: backgroundColor,
        }}
        selectedValue={forumId as number}
        onValueChange={(val: number) => {
          if (val !== forumId) {
            setForumId(val);
          }
        }}
      >
        {forums
          ?.filter((x) => x.id)
          ?.map((forum: any) => (
            <Picker.Item
              key={forum.id}
              label={forum.name}
              value={forum.id}
            ></Picker.Item>
          ))}
      </Picker>
    );
  }

  function Footer() {
    return (
      <View style={{ ...styles.footer, paddingBottom: insets.bottom }}>
        <View style={styles.footerLeft}></View>
        <TouchableOpacity onPress={addEmoji} style={styles.icon}>
          <TabBarIcon color={tintColor} name="smile-o"></TabBarIcon>
        </TouchableOpacity>

        <TouchableOpacity onPress={addImage} style={styles.icon}>
          <TabBarIcon color={tintColor} name="image"></TabBarIcon>
        </TouchableOpacity>
        <TouchableOpacity onPress={addDice} style={styles.icon}>
          <TabBarIcon color={tintColor} name="dot-circle-o"></TabBarIcon>
        </TouchableOpacity>
        <TouchableOpacity onPress={submit} style={styles.icon}>
          <TabBarIcon color={tintColor} name="send"></TabBarIcon>
        </TouchableOpacity>
      </View>
    );
  }
}

function EmoticonPicker(props: {
  visible: boolean;
  onInsert: (emoticon: string) => void;
}) {
  const emoticons = useEmoticons();
  const [data, setData] = useState<string[]>([]);
  const keyboard = useKeyboard();

  useEffect(() => {
    if (emoticons?.length) {
      setData(emoticons?.map((x) => x?.value)?.flat());
    }
  }, [emoticons]);
  return (
    <FlatList
      style={{
        height: keyboard.keyboardHeight || 200,
        overflow: "scroll",
        display: props.visible ? "flex" : "none",
        flex: 1,
      }}
      contentContainerStyle={{
        height: "auto",
      }}
      columnWrapperStyle={{
        justifyContent: "space-between",
        alignItems: "center",
      }}
      numColumns={3}
      data={data}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            props.onInsert(item);
          }}
          style={{
            width: "33%",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 5,
            paddingBottom: 5,
            marginTop: 1,
          }}
        >
          <Text>{item}</Text>
        </TouchableOpacity>
      )}
    ></FlatList>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "#eee",
    padding: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  footer: {
    marginLeft: -10,
    marginRight: -10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
  },
  icon: {
    flex: 1,
    alignItems: "center",
  },
  picker: {
    flex: 1,
  },
  footerLeft: {
    flex: 2,
  },
});
