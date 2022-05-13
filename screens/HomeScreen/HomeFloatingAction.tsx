import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { FloatingAction } from "react-native-floating-action";

import { threadAtom } from "@/atoms";
import { Octicon } from "@/components/Icon";
import { useThemeColor } from "@/components/Themed";

export default function HomeFloatingAction() {
  const tintColor = useThemeColor({}, "tint");
  const tintBackgroundColor = useThemeColor({}, "tintBackground");
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
      shadow={{ shadowColor: "transparent" }}
      floatingIcon={<Octicon name="plus" color="white" />}
      actions={[
        {
          icon: <Octicon name="list-unordered" color={tintColor} />,
          name: "recommend",
          color: tintBackgroundColor,
          text: "推荐串",
          textColor: tintColor,
          textBackground: tintBackgroundColor,
        },
        {
          icon: <Octicon name="pencil" color={tintColor} />,
          name: "post",
          color: tintBackgroundColor,
          text: "发布新串",
          textColor: tintColor,
          textBackground: tintBackgroundColor,
        },
        {
          icon: <Octicon name="search" color={tintColor} />,
          name: "search",
          color: tintBackgroundColor,
          text: "搜索",
          textColor: tintColor,
          textBackground: tintBackgroundColor,
        },
      ]}
      onPressItem={onPressFAB}
    />
  );
}
