import { useAtom } from "jotai";
import { useCallback } from "react";
import Toast from "react-native-toast-message";

import { signIn } from "../api/index";
import { Cookie } from "../screens/ProfileScreen/common";

import { cookiesAtom, signDictAtom } from "@/atoms";

export const useSignAll = () => {
  const [cookies] = useAtom<Cookie[]>(cookiesAtom);
  const [signDict, setSignDict] = useAtom(signDictAtom);
  const handleSignAll = useCallback(async () => {
    Toast.show({ type: "info", text1: "正在签到..." });
    const masterCookies = cookies.filter((cookie) => !cookie.master && cookie.id);
    const results = await Promise.all(
      masterCookies.map(async ({ hash, code }) => {
        const {
          data: { info, code: resultCode },
        } = await signIn(code.split("#")[0], hash);
        if (info && info.exp) {
          setSignDict({ ...signDict, [hash]: info });
        }
        return resultCode;
      })
    );
    const successCount = results.filter((code) => code === 7010).length;
    const completedCount = results.filter((code) => code === 7006).length;
    const errorCount = results.filter((code) => code !== 7010 && code !== 7006).length;

    Toast.show({
      type: "success",
      text1: `签到成功${successCount}个，已签到${completedCount}个，签到失败${errorCount}个`,
    });
  }, [cookies, setSignDict, signDict]);
  return handleSignAll;
};
