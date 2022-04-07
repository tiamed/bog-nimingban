import { Picker } from "@react-native-picker/picker";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";

import { showAddModalAtom, Cookie } from "./common";

import { importCookie } from "@/api";
import { cookiesAtom } from "@/atoms/index";
import { Button, Text, useThemeColor, View, TextInput } from "@/components/Themed";
import Errors from "@/constants/Errors";

export default function AddCookieModal(props: { cookie?: Cookie }) {
  const [visible, setVisible] = useAtom(showAddModalAtom);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [master, setMaster] = useState("");
  const [cookies, setCookies] = useAtom<Cookie[], Cookie[], void>(cookiesAtom);
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const close = () => {
    setName("");
    setCode("");
    setVisible(false);
  };
  const confirm = async () => {
    if (props.cookie) {
      const { id } = (props.cookie || {}) as Cookie;
      const oldCookie = cookies.find((cookie) => cookie.id === id);
      setCookies([
        ...cookies.filter((cookie) => cookie.id !== id),
        {
          ...(oldCookie as Cookie),
          name: name || id,
        },
      ]);
      close();
      return;
    }
    const [id, hash] = code.split("#");
    const validated = id?.length === 8 && hash?.length === 32;
    if (validated) {
      const masterCookie = cookies.find((cookie) => cookie.id === master);
      const masterCode = masterCookie ? `${masterCookie?.id}#${masterCookie?.hash}` : "0";
      const {
        data: { info, code },
      } = await importCookie(masterCode, `${id}#${hash}`);

      if (code === 3104) {
        let newCookies: Cookie[];
        if (master) {
          newCookies = info
            ?.filter((cookie) => cookie.cookie === id)
            ?.map(({ cookie, remarks }) => ({
              id: cookie,
              name: name || remarks || cookie,
              hash,
              code: `${masterCode}#${cookie}`,
              master,
            }));
        } else {
          newCookies = info.map(({ cookie, remarks }) => ({
            id: cookie,
            name: cookie === id ? name || remarks || cookie : cookie,
            hash,
            code: `${id}#${hash}#${cookie}`,
            master: cookie === id ? "" : id,
          }));
        }
        setCookies([
          ...cookies.filter(
            (cookie) => !newCookies.find((newCookie) => newCookie.id === cookie.id)
          ),
          ...newCookies,
        ]);
        Toast.show({
          type: "success",
          text1: "导入成功",
        });
      } else {
        Toast.show({
          type: "error",
          text1: Errors[code] || info.toString() || "出错了",
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "请检查饼干格式",
        text2: "8位代号#32位代码",
      });
    }
    close();
  };

  useEffect(() => {
    if (props.cookie) {
      setName(props.cookie.name);
      setMaster(props.cookie.master);
    }
  }, [props.cookie]);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={close}
      backdropOpacity={0.3}
      backdropTransitionOutTiming={0}
      avoidKeyboard>
      <View style={styles.modal}>
        <Text style={styles.title}>{props.cookie ? "修改饼干" : "添加饼干"}</Text>
        <TextInput
          placeholder="饼干名字，可不填"
          value={name}
          onChangeText={(val) => setName(val)}
          style={styles.input}
        />
        {!props.cookie?.hash && (
          <TextInput
            placeholder="饼干序列"
            value={code}
            onChangeText={(val) => setCode(val)}
            style={styles.input}
          />
        )}
        <View style={styles.pickerWrapper}>
          <Text style={{ ...styles.pickerLabel, color: tintColor }}>主饼干</Text>
          <Picker
            style={{
              ...styles.picker,
              color: tintColor,
              backgroundColor,
            }}
            itemStyle={{
              color: tintColor,
            }}
            selectedValue={master}
            onValueChange={(val: string) => setMaster(val)}>
            <Picker.Item label="无" value="" />
            {cookies
              ?.filter((cookie) => cookie.id && !cookie.master)
              ?.map((cookie: any) => (
                <Picker.Item key={cookie.id} label={cookie.name} value={cookie.id} />
              ))}
          </Picker>
        </View>
        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <Button title="取消" onPress={close} />
          </View>
          <View style={styles.footerButton}>
            <Button title="确定" onPress={confirm} disabled={!(code || props.cookie?.code)} />
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
    marginVertical: 10,
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
