import { Dimensions } from "react-native";
import DefaultModal, { ModalProps } from "react-native-modal";

const screenHeight = Dimensions.get("screen").height;

export default function Modal(props: Partial<ModalProps>) {
  const { children, ...otherProps } = props;
  return (
    <DefaultModal
      deviceHeight={screenHeight}
      backdropOpacity={0.3}
      backdropTransitionOutTiming={0}
      {...otherProps}>
      {children}
    </DefaultModal>
  );
}
