import Cookie from "./Cookie";
import Settings from "./Settings";

import { ScrollView } from "@/components/Themed";
import { RootTabScreenProps } from "@/types";

export default function ProfileScreen({ navigation }: RootTabScreenProps<"Profile">) {
  return (
    <ScrollView style={{ flex: 1, flexDirection: "column" }}>
      <Cookie />
      <Settings />
    </ScrollView>
  );
}
