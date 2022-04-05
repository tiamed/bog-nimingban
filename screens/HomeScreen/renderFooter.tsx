import { ActivityIndicator, Pressable } from "react-native";
import React, { useState, useEffect, useCallback, useMemo } from "react";

import { Text, View, useThemeColor } from "../../components/Themed";

import Loadings from "../../constants/Loadings";

export default function renderFooter(
  loading: boolean = false,
  hasNoMore: boolean = false,
  loadMore: () => void = () => {}
) {
  const [randomIndex, setRadomIndex] = useState(0);
  const onPress = useCallback(() => {
    if (!loading && typeof loadMore === "function") {
      loadMore();
    }
  }, [loadMore]);
  const LoadingText = useMemo(() => {
    if (loading) {
      return Loadings[randomIndex];
    } else {
      return hasNoMore ? "已经没有更多了" : "下拉加载更多";
    }
    return "";
  }, [loading, hasNoMore, randomIndex]);
  useEffect(() => {
    setRadomIndex((Loadings.length * Math.random()) | 0);
  }, []);
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <Text lightColor="#666666" darkColor="#999999">
          {LoadingText}
        </Text>
        {loading && (
          <ActivityIndicator
            size="small"
            color={useThemeColor({}, "tint")}
            style={{ marginLeft: 10 }}
          ></ActivityIndicator>
        )}
      </View>
    </Pressable>
  );
}
