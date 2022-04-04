import { useAtom } from "jotai";
import { Pressable, StyleSheet } from "react-native";
import { orderAtom, postFilteredAtom } from "../../atoms";
import { useThemeColor } from "../../components/Themed";
import Icon from "../../components/Icon";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function HeaderRight() {
  const activeColor = useThemeColor({}, "active");
  const inactiveColor = useThemeColor({}, "inactive");
  const [postFiltered, setPostFiltered] = useAtom(postFilteredAtom);
  const [order, setOrder] = useAtom(orderAtom);

  return (
    <>
      <Pressable
        style={styles.item}
        onPress={() => {
          setOrder(Number(!order));
          // navigation.
        }}
      >
        <Icon name={order ? "sort-desc" : "sort-asc"} color={activeColor} />
      </Pressable>
      <Pressable
        style={styles.item}
        onPress={() => {
          setPostFiltered(!postFiltered);
        }}
      >
        <Icon
          name="filter"
          color={postFiltered ? activeColor : inactiveColor}
        />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    marginLeft: 20,
  },
});
