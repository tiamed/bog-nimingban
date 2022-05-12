import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { FloatingAction } from "react-native-floating-action";

import { threadAtom } from "@/atoms";
import { Octicon } from "@/components/Icon";
import { useThemeColor } from "@/components/Themed";

export default function HomeFloatingAction() {
  const tintColor = useThemeColor({}, "tint");
  const overlayColor = useThemeColor({}, "overlay");
  const navigation = useNavigation();
  const [thread] = useAtom(threadAtom);

  const onPressFAB = (action: string | undefined) => {
    switch (action) {
      case "post":
        navigation.navigate("ReplyModal", {
          forumId: thread === 0 ? 1 : thread,
        });
        break;
      case "search":
        navigation.navigate("SearchModal");
        break;
      case "recommend":
        navigation.navigate("Recommend");
        break;
      default:
        break;
    }
  };
  return (
    <FloatingAction
      color={tintColor}
      overlayColor={overlayColor}
      floatingIcon={<Octicon name="plus" color="white" />}
      actions={[
        {
          icon: <Octicon name="list-unordered" color="white" />,
          name: "recommend",
          color: tintColor,
          text: "推荐串",
          textColor: "white",
          textBackground: tintColor,
        },
        {
          icon: <Octicon name="pencil" color="white" />,
          name: "post",
          color: tintColor,
          text: "发布新串",
          textColor: "white",
          textBackground: tintColor,
        },
        {
          icon: <Octicon name="search" color="white" />,
          name: "search",
          color: tintColor,
          text: "搜索",
          textColor: "white",
          textBackground: tintColor,
        },
      ]}
      onPressItem={onPressFAB}
    />
  );
}
