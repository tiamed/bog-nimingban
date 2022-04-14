import { Dimensions } from "react-native";
import DefaultModal, { ModalProps } from "react-native-modal";

const screenHeight = Dimensions.get("screen").height;

export default function Modal(props: Partial<ModalProps>) {
  return (
    <DefaultModal
      {...props}
      deviceHeight={screenHeight}
      statusBarTranslucent
      backdropOpacity={0.3}
      backdropTransitionOutTiming={0}>
      {props.children}
    </DefaultModal>
  );
}
