import useForums from "../hooks/useForums";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { threadAtom } from "../atoms";
import { useSetAtom } from "jotai";

export default function DrawerContent(props: any) {
  const forums = useForums();
  const setThread = useSetAtom(threadAtom);
  return (
    <DrawerContentScrollView>
      {forums
        ?.filter((forum) => !forum.hide)
        ?.map((forum) => (
          <DrawerItem
            key={forum.id}
            label={forum.name}
            onPress={() => {
              setThread(forum.id);
              props.navigation.closeDrawer();
            }}
          ></DrawerItem>
        ))}
    </DrawerContentScrollView>
  );
}
