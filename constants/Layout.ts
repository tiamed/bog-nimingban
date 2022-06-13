import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  postHorizontalPadding: 16,
  postHorizontalPaddingSecondary: 4,
  settingItemPaddingRight: 16,
  toastMaxLine: 20,
  settingKeys: [
    "baseSize",
    "lineHeight",
    "maxLine",
    "threadDirection",
    "thumbnailResize",
    "imageWidth",
    "accurateTimeFormat",
    "footerLayout",
    "fontFamily",
    "showTabBarLabel",
    "showThreadReply",
    "threadReplyReverse",
    "groupSearchResults",
    "fullscreenInput",
    "order",
    "bottomGap",
    "postFilteredRecords",
    "shouldMemorizePostFiltered",
    "emoticonPickerHeight",
  ],
};
