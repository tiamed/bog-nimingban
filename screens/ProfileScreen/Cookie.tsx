import { parseISO } from "date-fns";
import * as Clipboard from "expo-clipboard";
import { useAtom, useSetAtom } from "jotai";
import { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

import AddCookieModal from "./AddCookieModal";
import CreateCookieModal from "./CreateCookieModal";
import { Cookie, showAddModalAtom, showCreateModalAtom } from "./common";

import { SizeContext } from "@/Provider";
import { SignInfo, signIn, deleteSlaveCookie } from "@/api";
import { cookiesAtom, selectedCookieAtom, signDictAtom } from "@/atoms/index";
import Icon from "@/components/Icon";
import { Button, Text, useThemeColor } from "@/components/Themed";
import Errors from "@/constants/Errors";

interface SignDict {
  [key: string]: SignInfo;
}

export { Cookie } from "./common";

export default function Cookies() {
  const [current, setCurrent] = useState<Cookie | undefined>(undefined);
  const [cookies, setCookies] = useAtom<Cookie[], Cookie[], void>(cookiesAtom);
  const [slaveCookiesWithoutMaster, setSlaveCookiesWithoutMaster] = useState<Cookie[]>([]);
  const [signDict, setSignDict] = useAtom<SignDict, SignDict, void>(signDictAtom);
  const [selectedCookie, setSelectedCookie] = useAtom(selectedCookieAtom);
  const setShowAddModal = useSetAtom(showAddModalAtom);
  const setShowCreateModal = useSetAtom(showCreateModalAtom);
  const iconColor = useThemeColor({}, "tint");
  const BASE_SIZE = useContext(SizeContext);

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
        Toast.show({ type: "error", text1: Errors[code] || info.toString() });
        break;
    }
    if (info && info.exp) {
      setSignDict({ ...signDict, [cookie.hash]: info });
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
          text1: Errors[code] || "出错了",
        });
        return;
      }
      setCookies(cookies.filter((c) => c.code !== cookie.code));
    } else {
      setCookies(cookies.filter((c) => c.hash !== cookie.hash));
    }
    if (selectedCookie === cookie.code) {
      setSelectedCookie("");
    }
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

  useEffect(() => {
    setSlaveCookiesWithoutMaster(
      cookies.filter((c) => c.master && cookies.findIndex((c2) => c2.id === c.master) === -1)
    );
  }, [cookies]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: BASE_SIZE * 1.25 }]}>饼干管理</Text>
      <View>
        {cookies
          .filter((cookie) => !cookie.master && cookie.id)
          .map((cookie, index) => (
            <View key={index} style={styles.cookieWrapper}>
              <CookieItem cookie={cookie} />
              <View style={styles.cookieSlave}>
                {cookies
                  .filter((slave) => slave.master === cookie.id)
                  .map((slave, index) => (
                    <CookieItem key={index} cookie={slave} isSlave />
                  ))}
              </View>
            </View>
          ))}
        <View style={styles.cookieWrapper}>
          {slaveCookiesWithoutMaster?.length > 0 && (
            <>
              <CookieItem cookie={{} as Cookie} />
              <View style={styles.cookieSlave}>
                {slaveCookiesWithoutMaster.map((slave, index) => (
                  <CookieItem key={index} cookie={slave} isSlave />
                ))}
              </View>
            </>
          )}
        </View>
      </View>
      <View style={styles.cookieAction}>
        <Button
          title="获取饼干"
          onPress={() => {
            setShowCreateModal(true);
          }}
        />
        <Button
          title="添加饼干"
          style={{ marginLeft: 10 }}
          onPress={() => {
            setCurrent(undefined);
            setShowAddModal(true);
          }}
        />
      </View>
      <AddCookieModal cookie={current} />
      <CreateCookieModal />
    </View>
  );

  function CookieItem(props: { cookie: Cookie; isSlave?: boolean }) {
    const { cookie, isSlave } = props;
    return (
      <View style={styles.cookie}>
        <TouchableOpacity
          style={styles.edit}
          disabled={!cookie.id}
          onPress={() => {
            setCurrent(cookie);
            setShowAddModal(true);
          }}>
          <Icon name="edit" color={iconColor} />
        </TouchableOpacity>
        {isSlave ? (
          <TouchableOpacity
            style={styles.edit}
            disabled={!cookie.id}
            onPress={() => {
              Toast.show({
                type: "error",
                text1: "影武者无法导出",
              });
            }}>
            <Icon name="user-secret" color={iconColor} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.edit}
            disabled={!cookie.id}
            onPress={() => handleCopy(cookie)}>
            <Icon name="download" color={iconColor} />
          </TouchableOpacity>
        )}

        <Text style={styles.cookieName}>{cookie.name || "流浪武者"}</Text>
        {!isSlave && (
          <>
            <Text style={styles.cookieSigned}>已签到{signDict?.[cookie.hash]?.sign || 0}天</Text>
            <Button title="签到" disabled={!cookie.id} onPress={() => handleSign(cookie)} />
          </>
        )}
        {isSlave && <Text style={styles.cookieSlaveLabel}>影武者</Text>}
        <TouchableOpacity
          style={styles.delete}
          disabled={!cookie.id}
          onPress={() => confirmDelete(cookie)}>
          <Icon name="minus-circle" color={iconColor} />
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
