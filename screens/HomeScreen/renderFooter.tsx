/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

import { Text, useThemeColor } from "@/components/Themed";
import Loadings from "@/constants/Loadings";

export default function renderFooter({
  loading = false,
  hasNoMore = false,
  empty = false,
  loadMore = () => {},
}: {
  loading: boolean;
  hasNoMore: boolean;
  empty?: boolean;
  loadMore?: () => void;
}) {
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
      if (empty) return "暂无数据";
      return hasNoMore ? "已经没有更多了" : "下拉加载更多";
    }
  }, [loading, hasNoMore, empty, randomIndex]);
  useEffect(() => {
    setRadomIndex((Loadings.length * Math.random()) | 0);
  }, []);
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          padding: 16,
        }}>
        <Text lightColor="#666666" darkColor="#999999">
          {LoadingText}
        </Text>
        {loading && (
          <ActivityIndicator
            size="small"
            color={useThemeColor({}, "tint")}
            style={{ marginLeft: 10 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
