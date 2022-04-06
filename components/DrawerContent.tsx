import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useSetAtom } from "jotai";

import { threadAtom } from "@/atoms";
import useForums from "@/hooks/useForums";

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
          />
        ))}
    </DrawerContentScrollView>
  );
}
