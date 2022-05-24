import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { atom, useAtom } from "jotai";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import { Cookie } from "../ProfileScreen/common";

import Modal from "@/components/Modal";
import { Button, Text, View, TextInput } from "@/components/Themed";
import { getItemChunked, setItemChunked } from "@/utils/chunkedAsyncStorage";

const BACKUP_KEYS = ["cookies", "favoriteTags", "blackListPosts", "blackListCookies"];

const CHUNKED_BACKUP_KEYS = ["history", "replyHistory", "favorite"];

export const showBackupModalAtom = atom(false);

export default function AddCookieModal(props: { cookie?: Cookie }) {
  const [visible, setVisible] = useAtom(showBackupModalAtom);
  const [imported, setImported] = useState({});
  const [url, setUrl] = useState("");
  const close = () => {
    setVisible(false);
  };

  const getFileName = () => {
    return "bog-nimingban_backup" + format(Date.now(), "yyyy-MM-dd_HH:mm:ss") + ".json";
  };

  const handleExport = async () => {
    try {
      const promises = BACKUP_KEYS.map(async (key) => {
        return [key, JSON.parse((await AsyncStorage.getItem(key)) || "[]")];
      });
      const chunkedPromises = CHUNKED_BACKUP_KEYS.map(async (key) => {
        return [key, await getItemChunked(key)];
      });
      const backup = await Promise.all(promises);
      const chunkedBackup = await Promise.all(chunkedPromises);
      const path = (FileSystem.documentDirectory as string) + getFileName();
      await FileSystem.writeAsStringAsync(path, JSON.stringify(backup.concat(chunkedBackup)));
      await Sharing.shareAsync(path);
    } catch (error) {
      Toast.show({ type: "error", text1: (error as Error).message });
    } finally {
      close();
    }
  };

  const confirmImport = (onPress: any) => {
    Alert.alert("确认导入", "导入后将覆盖当前数据，确认导入吗？", [
      {
        text: "取消",
      },
      {
        text: "确认",
        onPress,
      },
    ]);
  };

  const handleUrlImport = async () => {
    if (!url) {
      Toast.show({ type: "error", text1: "请输入链接" });
      return;
    }
    try {
      const { uri } = await FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + getFileName()
      );
      handleImport(uri);
    } catch (error) {
      Toast.show({ type: "error", text1: (error as Error).message });
    }
  };

  const handleFileImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "application/json" });
      if (result.type === "cancel") {
        Toast.show({ type: "error", text1: "导入取消" });
      } else {
        const { uri } = result;
        confirmImport(() => handleImport(uri));
      }
    } catch (error) {
      Toast.show({ type: "error", text1: (error as Error).message });
    }
  };

  const handleImport = async (uri: string) => {
    try {
      const backup = JSON.parse(await FileSystem.readAsStringAsync(uri));
      const promises = backup.map(async ([key, value]: [key: string, value: any]) => {
        if (BACKUP_KEYS.includes(key)) {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        }
        if (CHUNKED_BACKUP_KEYS.includes(key)) {
          await setItemChunked(key, value);
        }
      });
      await Promise.all(promises);
      setImported(backup);
      Toast.show({ type: "success", text1: "导入成功", text2: "若数据未刷新请重启应用" });
    } catch (error) {
      Toast.show({ type: "error", text1: (error as Error).message });
    } finally {
      close();
    }
  };

  return (
    <Modal isVisible={visible} onBackdropPress={close} avoidKeyboard>
      <View style={styles.modal}>
        <Text style={styles.title}>备份</Text>
        <TextInput
          placeholder="导入链接"
          value={url}
          onChangeText={(val) => setUrl(val)}
          style={styles.input}
        />
        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <Button title="导出" onPress={handleExport} />
          </View>
          <View style={styles.footerButton}>
            <Button title="文件导入" onPress={handleFileImport} disabled={!imported} />
          </View>
          <View style={styles.footerButton}>
            <Button
              title="链接导入"
              onPress={() => confirmImport(handleUrlImport)}
              disabled={!imported}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modal: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    padding: 20,
  },
  input: {
    margin: 2,
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
    overflow: "hidden",
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    paddingVertical: 10,
  },
  footerButton: {
    marginLeft: 20,
  },
  picker: {
    flex: 1,
  },
  pickerWrapper: {
    minHeight: 30,
    maxHeight: 60,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    overflow: "hidden",
  },
  pickerLabel: {
    width: "30%",
  },
});
