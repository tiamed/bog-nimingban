import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";

import { Button, Text, useThemeColor, View } from "../../components/Themed";
import { cookiesAtom, signDictAtom } from "../../atoms/index";
import { atom, useAtom, useSetAtom } from "jotai";
import TabBarIcon from "../../components/TabBarIcon";
import Modal from "react-native-modal";
import { useEffect, useState } from "react";
import { SignInfo, signIn, getCookie } from "../../api";
import Toast from "react-native-root-toast";
import { parseISO, addSeconds, format, formatRelative } from "date-fns";
import { zhCN } from "date-fns/locale";

export interface Cookie {
  name: string;
  code: string;
  hash: string;
  id: string;
}

interface SignDict {
  [key: string]: SignInfo;
}

const showAddModalAtom = atom(false);

export default function Cookie() {
  const [current, setCurrent] = useState<Cookie | undefined>(undefined);
  const [cookies, setCookies] = useAtom<Cookie[], Cookie[], void>(cookiesAtom);
  const [signDict, setSignDict] = useAtom<SignDict, SignDict, void>(
    signDictAtom
  );
  const setShowAddModal = useSetAtom(showAddModalAtom);
  const iconColor = useThemeColor({}, "tint");

  const getCanSign = (utcTimeString: string) => {
    const signTime = parseISO(utcTimeString);
    const timestamp = signTime.getTime();
    if (Number.isNaN(timestamp) || timestamp < 0) {
      return true;
    }
    return Date.now() > timestamp;
  };

  const handleSign = async (cookie: Cookie) => {
    const signTime = signDict[cookie.hash]?.signtime;
    if (!getCanSign(signTime)) {
      Toast.show("已经签到过了");
      return;
    }
    const {
      data: { info, code },
    } = await signIn(cookie.code.split("#")[0], cookie.hash);
    switch (code) {
      case 7010:
        Toast.show("签到成功，当前已签到" + info.sign + "天");
        break;
      case 7006:
        Toast.show("已经签到过了，已签到" + info.sign + "天");
        break;
      default:
        Toast.show(info.toString());
        break;
    }
    if (info && info.exp) {
      setSignDict({ ...signDict, [cookie.hash]: info });
    }
  };

  const handleAddCookie = async () => {
    const {
      data: { code, info },
    } = await getCookie();
    if (code === 2) {
      const [name, hash] = info.split("#");
      setCurrent({ name, code: info, hash, id: name });
      setShowAddModal(true);
    } else {
      switch (code) {
        case 2001:
          Toast.show(
            `${formatRelative(
              addSeconds(new Date(), Number(info)),
              Date.now(),
              {
                locale: zhCN,
              }
            )} 才可以获取饼干`
          );
          break;
        default:
          Toast.show(
            {
              2002: "当前关闭了饼干领取",
              2003: "IP地址不合理，有可能是伪造的IP地址",
              2004: "饼干领取系统调用限制",
              2005: "IP地址不在系统允许的范围内",
            }[code] || info
          );
          break;
      }
    }
  };

  const handleCopy = (cookie: Cookie) => {
    const cookieCodeDisposable = cookie.id
      ? `${cookie.id}#${cookie.hash}`
      : cookie.code.split("#").slice(0, 2).join("#");
    Clipboard.setString(cookieCodeDisposable);
    Toast.show(`饼干${cookie.name}已导出到剪贴板`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>饼干管理</Text>
      <View>
        {cookies.map((cookie, index) => (
          <View style={styles.cookie} key={index}>
            <TouchableOpacity
              style={styles.edit}
              onPress={() => {
                setCurrent(cookie);
                setShowAddModal(true);
              }}
            >
              <TabBarIcon name="edit" color={iconColor}></TabBarIcon>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.edit}
              onPress={handleCopy.bind(null, cookie)}
            >
              <TabBarIcon name="download" color={iconColor}></TabBarIcon>
            </TouchableOpacity>
            <Text style={styles.cookieName}>{cookie.name}</Text>
            <Text style={styles.cookieSigned}>
              已签到{signDict?.[cookie.hash]?.sign || 0}天
            </Text>
            <Button
              title="签到"
              onPress={handleSign.bind(null, cookie)}
            ></Button>
            <TouchableOpacity
              style={styles.delete}
              onPress={() => {
                setCookies(cookies.filter((c) => c.hash !== cookie.hash));
              }}
            >
              <TabBarIcon name="minus-circle" color={iconColor}></TabBarIcon>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.cookieAction}>
        <Button title="获取饼干" onPress={handleAddCookie} />
        <Button
          title="添加饼干"
          style={{ marginLeft: 10 }}
          onPress={() => {
            setCurrent(undefined);
            setShowAddModal(true);
          }}
        />
      </View>
      <AddModal cookie={current}></AddModal>
    </View>
  );
}

function AddModal(props: { cookie?: Cookie }) {
  const [visible, setVisible] = useAtom(showAddModalAtom);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [cookies, setCookies] = useAtom<Cookie[], Cookie[], void>(cookiesAtom);
  const close = () => {
    setName("");
    setCode("");
    setVisible(false);
  };
  const confirm = () => {
    const [id, hash] = (props.cookie?.code || code).split("#");
    if (id && hash) {
      setCookies([
        ...cookies.filter((cookie) => cookie.hash !== hash),
        {
          name: name || id,
          code: `${id}#${hash}#${id}`,
          hash: hash,
          id,
        },
      ]);
    }
    close();
  };

  useEffect(() => {
    if (props.cookie) {
      setName(props.cookie.name);
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
  container: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingLeft: 15,
    paddingRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  cookie: {
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cookieSigned: {
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 4,
    textAlign: "center",
    fontSize: 10,
    lineHeight: 20,
    marginRight: 10,
    paddingHorizontal: 5,
  },
  cookieName: {
    minWidth: 80,
  },
  cookieAction: {
    flexDirection: "row",
    marginTop: 10,
  },
  modal: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
  input: {
    backgroundColor: "#eee",
    margin: 2,
    padding: 5,
    borderRadius: 5,
    overflow: "hidden",
    width: "100%",
  },
  edit: {
    marginRight: 10,
  },
  delete: {
    marginLeft: 40,
  },
  footer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    padding: 10,
  },
  footerButton: {
    marginLeft: 20,
  },
});
