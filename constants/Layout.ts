import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  size: {
    small: 12,
    normal: 14,
    medium: 16,
    large: 18,
    extraLarge: 20,
  },
};
