import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";

import { Button, Text, useThemeColor, View } from "../../components/Themed";
import { cookiesAtom, signDictAtom } from "../../atoms/index";
import { atom, useAtom, useSetAtom } from "jotai";
import Icon from "../../components/Icon";
import { useState } from "react";
import { SignInfo, signIn, createCookie, deleteSlaveCookie } from "../../api";
import Toast from "react-native-toast-message";
import { parseISO, addSeconds, format, formatRelative } from "date-fns";
import { zhCN } from "date-fns/locale";
import AddCookieModal from "./AddCookieModal";
import { Cookie, showAddModalAtom } from "./common";

interface SignDict {
  [key: string]: SignInfo;
}

export { Cookie } from "./common";

export default function Cookies() {
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
      Toast.show({ type: "error", text1: "已经签到过了" });
      return;
    }
    const {
      data: { info, code },
    } = await signIn(cookie.code.split("#")[0], cookie.hash);
    switch (code) {
      case 7010:
        Toast.show({
          type: "success",
          text1: "签到成功，当前已签到" + info.sign + "天",
        });
        break;
      case 7006:
        Toast.show({
          type: "error",
          text1: "已经签到过了，已签到" + info.sign + "天",
        });
        break;
      default:
        Toast.show({ type: "error", text1: info.toString() });
        break;
    }
    if (info && info.exp) {
      setSignDict({ ...signDict, [cookie.hash]: info });
    }
  };

  const handleCreateCookie = async () => {
    const {
      data: { code, info },
    } = await createCookie();
    if (code === 2) {
      const [name, hash] = info.split("#");
      setCurrent({ name, code: info, hash, id: name, master: "" });
      setShowAddModal(true);
    } else {
      switch (code) {
        case 2001:
          Toast.show({
            type: "error",
            text1: `${formatRelative(
              addSeconds(new Date(), Number(info)),
              Date.now(),
              {
                locale: zhCN,
              }
            )} 才可以获取饼干`,
          });
          break;
        default:
          Toast.show({
            type: "error",
            text1:
              {
                2002: "当前关闭了饼干领取",
                2003: "IP地址不合理，有可能是伪造的IP地址",
                2004: "饼干领取系统调用限制",
                2005: "IP地址不在系统允许的范围内",
              }[code] || info,
          });
          break;
      }
    }
  };

  const handleCopy = (cookie: Cookie) => {
    const cookieCodeDisposable = cookie.id
      ? `${cookie.id}#${cookie.hash}`
      : cookie.code.split("#").slice(0, 2).join("#");
    Clipboard.setString(cookieCodeDisposable);
    Toast.show({ type: "success", text1: `饼干${cookie.name}已导出到剪贴板` });
  };

  const handleDelete = async (cookie: Cookie) => {
    if (cookie.master) {
      const {
        data: { code },
      } = await deleteSlaveCookie(cookie.master, cookie.hash, cookie.id);
      if (code === 3007) {
        Toast.show({
          type: "success",
          text1: "已删除影武者",
        });
      } else {
        Toast.show({
          type: "error",
          text1:
            {
              3001: "饼干无效，系统中没有记录这块饼干	",
              3005: "主饼干无法删除	",
              3006: "不是自己的饼干无法执行",
              3103: "主饼干是无效的，无法执行影武者操作",
              3105: "没有要执行的饼干",
            }[code] || "出错了",
        });
        return;
      }
    }
    setCookies(cookies.filter((c) => c.code !== cookie.code));
  };

  const confirmDelete = (cookie: Cookie) => {
    Alert.alert("确认删除吗？", cookie.master ? "影武者删除后不可恢复" : "", [
      { text: "取消" },
      {
        text: "确认",
        onPress: handleDelete.bind(null, cookie),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>饼干管理</Text>
      <View>
        {cookies
          .filter((cookie) => !cookie.master && cookie.id)
          .map((cookie, index) => (
            <View key={index} style={styles.cookieWrapper}>
              <CookieItem cookie={cookie}></CookieItem>
              <View style={styles.cookieSlave}>
                {cookies
                  .filter((slave) => slave.master === cookie.id)
                  .map((slave, index) => (
                    <CookieItem key={index} cookie={slave} isSlave></CookieItem>
                  ))}
              </View>
            </View>
          ))}
      </View>
      <View style={styles.cookieAction}>
        <Button title="获取饼干" onPress={handleCreateCookie} />
        <Button
          title="添加饼干"
          style={{ marginLeft: 10 }}
          onPress={() => {
            setCurrent(undefined);
            setShowAddModal(true);
          }}
        />
      </View>
      <AddCookieModal cookie={current}></AddCookieModal>
    </View>
  );

  function CookieItem(props: { cookie: Cookie; isSlave?: boolean }) {
    const { cookie, isSlave } = props;
    return (
      <View style={styles.cookie}>
        {isSlave && (
          <View style={styles.edit}>
            <Icon name="user-secret" color={iconColor}></Icon>
          </View>
        )}
        <TouchableOpacity
          style={styles.edit}
          onPress={() => {
            setCurrent(cookie);
            setShowAddModal(true);
          }}
        >
          <Icon name="edit" color={iconColor}></Icon>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.edit}
          onPress={handleCopy.bind(null, cookie)}
        >
          <Icon name="download" color={iconColor}></Icon>
        </TouchableOpacity>
        <Text style={styles.cookieName}>{cookie.name}</Text>
        {!isSlave && (
          <>
            <Text style={styles.cookieSigned}>
              已签到{signDict?.[cookie.hash]?.sign || 0}天
            </Text>
            <Button
              title="签到"
              onPress={handleSign.bind(null, cookie)}
            ></Button>
          </>
        )}
        {isSlave && <Text style={styles.cookieSlaveLabel}>影武者</Text>}
        <TouchableOpacity
          style={styles.delete}
          onPress={confirmDelete.bind(null, cookie)}
        >
          <Icon name="minus-circle" color={iconColor}></Icon>
        </TouchableOpacity>
      </View>
    );
  }
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
    marginVertical: 10,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  cookieWrapper: {
    flexDirection: "column",
    paddingLeft: 15,
    paddingRight: 15,
  },
  cookie: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cookieSlave: {
    paddingLeft: 32,
  },
  cookieSlaveLabel: {
    fontSize: 10,
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 5,
    lineHeight: 20,
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
  edit: {
    marginRight: 10,
  },
  delete: {
    marginLeft: 40,
  },
});
