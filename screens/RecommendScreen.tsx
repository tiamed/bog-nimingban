import { useNavigation } from "@react-navigation/native";
import { parse, HTMLElement } from "node-html-parser";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from "react-native";

import { getRecommendations } from "@/api";
import { SizeContext } from "@/components/ThemeContextProvider";
import { View, Text, useThemeColor } from "@/components/Themed";
import { RootStackScreenProps } from "@/types";

const width = Dimensions.get("window").width;

interface RecommendItem {
  id: string;
  name: string;
}

interface RecommendSectionData {
  title: string;
  data: RecommendItem[];
}

export default function RecommendScreen({ route, navigation }: RootStackScreenProps<"Recommend">) {
  const [recommendData, setRecommendData] = useState<RecommendSectionData[]>([]);

  const getData = async () => {
    const { data } = await getRecommendations();
    const root = parse(data);
    const raw = root.querySelector("dl")?.removeWhitespace().childNodes;
    if (!raw) return [];
    const keys = raw
      .filter((node) => (node as unknown as HTMLElement).rawTagName === "dt")
      .map((node) => node.textContent);
    const values = raw
      .filter((node) => (node as unknown as HTMLElement).rawTagName === "dd")
      .map((node) =>
        (node as unknown as HTMLElement).querySelectorAll("[data-tid]").map((childNode) => ({
          id: childNode.getAttribute("data-tid") || "",
          name: childNode.textContent,
        }))
      );
    const list = keys.map((key, idx) => ({ title: key, data: values[idx] }));
    return list;
  };

  useEffect(() => {
    getData().then((data) => {
      if (data) {
        setRecommendData(data);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={recommendData}
        renderItem={({ item }) => <RecommendSection title={item.title} data={item.data} />}
        keyExtractor={(item) => item.title}
      />
    </View>
  );
}

function RecommendSection(props: RecommendSectionData) {
  const borderColor = useThemeColor({}, "border");
  const backgroundColor = useThemeColor({}, "replyBackground");
  const navigation = useNavigation();
  const BASE_SIZE = useContext(SizeContext);
  return (
    <View style={styles.section}>
      <Text style={[styles.title, { fontSize: BASE_SIZE * 1.25 }]}>{props.title}</Text>
      <FlatList
        data={props.data}
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.itemWrapper, { borderColor, backgroundColor }]}
            onPress={() => {
              navigation.navigate("Post", {
                id: Number(item.id),
                title: `Po.${item.id}`,
              });
            }}>
            <Text
              lightColor="#434343"
              darkColor="#d9d9d9"
              style={[styles.item, { fontSize: BASE_SIZE * 0.8 }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  section: {
    margin: 15,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemWrapper: {
    width: "30%",
    marginVertical: 5,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
  },
  item: {
    paddingVertical: 8,
    textAlign: "center",
  },
  contentContainer: {
    height: "auto",
  },
  columnWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
});
