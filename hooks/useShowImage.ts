import NetInfo, { NetInfoStateType } from "@react-native-community/netinfo";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import { noImageModeAtom } from "@/atoms";

export default function useShowImage() {
  const [noImageMode] = useAtom(noImageModeAtom);
  const [showImage, setShowImage] = useState(true);

  useEffect(() => {
    switch (noImageMode) {
      case "on":
        setShowImage(false);
        break;
      case "off":
        setShowImage(true);
        break;
      case "cellular":
        NetInfo.fetch().then((state) => {
          if (state.isConnected && state.type === NetInfoStateType.cellular) {
            setShowImage(false);
          } else {
            setShowImage(true);
          }
        });
        break;
      default:
        setShowImage(true);
        break;
    }
  });

  return showImage;
}
