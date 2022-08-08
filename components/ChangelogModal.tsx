import { marked } from "marked";
import { Linking, StyleSheet, TouchableOpacity } from "react-native";
import HTMLView from "react-native-htmlview";

import Modal from "./Modal";
import { Button, ScrollView, Text, View, useThemeColor } from "./Themed";

import useReleases from "@/hooks/useReleases";
import { formatTime } from "@/utils/format";

function Changelog() {
  const releases: any[] = useReleases();
  const borderColor = useThemeColor({}, "border");
  const tintColor = useThemeColor({}, "tint");
  return (
    <>
      {releases.map((release) => (
        <View key={release.id}>
          <TouchableOpacity
            onPress={() => Linking.openURL(release.html_url)}
            style={[
              {
                backgroundColor: tintColor,
              },
              styles.sectionHeader,
            ]}>
            <Text style={styles.sectionTag}>{release.tag_name}</Text>
            <Text style={styles.sectionTime}>
              ({formatTime(new Date(release.published_at).getTime(), true)})
            </Text>
          </TouchableOpacity>
          <HTMLView
            value={marked(release.body, {
              // breaks: true,
            })}
            addLineBreaks={false}
            stylesheet={{
              h1: {
                fontSize: 20,
              },
              h2: {
                fontSize: 18,
              },
              h3: {
                fontSize: 16,
              },
              ul: {
                padding: 0,
                margin: 0,
                borderWidth: 1,
                borderColor,
                // borderRadius: 10,
              },
              li: {
                fontSize: 12,
              },
            }}
          />
        </View>
      ))}
    </>
  );
}

export default function ChangelogModal(props: { visible: boolean; onClose: () => void }) {
  return (
    <Modal
      isVisible={props.visible}
      onBackdropPress={props.onClose}
      animationInTiming={1}
      animationOutTiming={1}>
      <View style={styles.modal}>
        <View>
          <Text style={styles.title}>更新日志</Text>
        </View>
        <ScrollView style={styles.content}>
          <Changelog />
        </ScrollView>
        <View style={styles.footer}>
          <Button onPress={props.onClose} title="确定" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "flex-start",
    borderRadius: 10,
    overflow: "hidden",
    width: 300,
    paddingVertical: 6,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    paddingVertical: 10,
  },
  content: {
    height: 400,
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 10,
  },
  sectionTag: {
    color: "white",
  },
  sectionTime: {
    color: "white",
    marginLeft: 10,
    fontSize: 10,
  },
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
