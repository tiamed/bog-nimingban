import { StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";

import {
  Button,
  Text,
  useThemeColor,
  View,
  TextInput,
} from "../../components/Themed";
import { cookiesAtom } from "../../atoms/index";
import { useAtom } from "jotai";
import Modal from "react-native-modal";
import { useEffect, useState } from "react";
import { importCookie } from "../../api";
import { showAddModalAtom, Cookie } from "./common";

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
    const [id, hash] = (props.cookie?.code || code).split("#");
    if (id && hash) {
      const {
        data: { info, code },
      } = await importCookie(master, `${id}#${hash}`);

      if (code === 3104) {
        const newCookies = info?.map(({ cookie, remarks }) => ({
          id: cookie,
          name: remarks || cookie,
          hash,
          code: `${id}#${hash}#${cookie}`,
          master: id === cookie ? "" : id,
        }));
        setCookies([
          ...cookies.filter(
            (cookie) =>
              !newCookies.find((newCookie) => newCookie.id === cookie.id)
          ),
          ...newCookies,
        ]);
      } else {
        Toast.show({
          type: "success",
          text1:
            {
              3001: "饼干无效，系统中没有记录这块饼干",
              3101: "已经是影武者的饼干，无法再次导入",
              3103: "主饼干是无效的，无法执行影武者操作	无法执行导入操",
              3106: "影武者已达上限，无法继续导入",
            }[code] || "出错了",
        });
      }
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
    <Modal isVisible={visible} onBackdropPress={close}>
      <View style={styles.modal}>
        <Text style={styles.title}>
          {props.cookie ? "修改饼干" : "添加饼干"}
        </Text>
        <TextInput
          placeholder="饼干名字，可不填"
          value={name}
          onChangeText={(val) => setName(val)}
          style={styles.input}
        ></TextInput>
        {!props.cookie?.hash && (
          <TextInput
            placeholder="饼干序列"
            value={code}
            onChangeText={(val) => setCode(val)}
            style={styles.input}
          ></TextInput>
        )}
        <View style={styles.pickerWrapper}>
          <Text style={{ ...styles.pickerLabel, color: tintColor }}>
            主饼干
          </Text>
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
            onValueChange={(val: string) => setMaster(val)}
          >
            <Picker.Item label="无" value=""></Picker.Item>
            {cookies
              ?.filter((cookie) => cookie.id && !cookie.master)
              ?.map((cookie: any) => (
                <Picker.Item
                  key={cookie.hash}
                  label={cookie.name}
                  value={cookie.code}
                ></Picker.Item>
              ))}
          </Picker>
        </View>
        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <Button title="取消" onPress={close}></Button>
          </View>
          <View style={styles.footerButton}>
            <Button
              title="确定"
              onPress={confirm}
              disabled={!Boolean(code || props.cookie?.code)}
            ></Button>
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
