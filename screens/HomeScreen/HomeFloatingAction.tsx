import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { FloatingAction } from "react-native-floating-action";
import { threadAtom } from "../../atoms";
import { useThemeColor } from "../../components/Themed";
import Icon from "../../components/Icon";

export default function HomeFloatingAction() {
  const tintColor = useThemeColor({}, "tint");
  const navigation = useNavigation();
  const [thread] = useAtom(threadAtom);

  const onPressFAB = (action: string | undefined) => {
    switch (action) {
      case "post":
        navigation.navigate("ReplyModal", {
          forumId: thread,
        });
        break;
      case "search":
        navigation.navigate("SearchModal");
        break;
      default:
        break;
    }
  };
  return (
    <FloatingAction
      color={tintColor}
      actions={[
        {
          icon: <Icon name="edit" color="white" />,
          name: "post",
          color: tintColor,
        },
        {
          icon: <Icon name="search" color="white" />,
          name: "search",
          color: tintColor,
        },
      ]}
      onPressItem={onPressFAB}
    ></FloatingAction>
  );
}