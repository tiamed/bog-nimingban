import { useNavigation } from "@react-navigation/native";

import SettingItem from "./SettingItem";

import { RootStackParamList } from "@/types";

export default function JumpToSettings(props: {
  title: string;
  desc?: string;
  navigateTo: keyof RootStackParamList;
}) {
  const navigation = useNavigation();
  return (
    <SettingItem
      title={props.title}
      desc={props.desc}
      onPress={() => {
        navigation.navigate(props.navigateTo);
      }}
    />
  );
}
