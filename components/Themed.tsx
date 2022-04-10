/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { forwardRef, useContext } from "react";
import {
  Text as DefaultText,
  View as DefaultView,
  ScrollView as DefaultScrollView,
  Button as DefaultButton,
  TouchableOpacity,
  TextInput as DefaultTextInput,
} from "react-native";
import { SuccessToast, InfoToast, ErrorToast } from "react-native-toast-message";

import Colors from "../constants/Colors";
import { ColorSchemeContext, SizeContext } from "./ThemeContextProvider";

import useColor from "@/hooks/useColor";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const colors = useColor();
  const theme = useContext(ColorSchemeContext);
  const colorFromProps = props[theme as "light" | "dark"];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return colors[theme as "light" | "dark"][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type ScrollViewProps = ThemeProps & DefaultScrollView["props"];
export type ButtonProps = ThemeProps & DefaultButton["props"] & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const BASE_SIZE = useContext(SizeContext);

  return (
    <DefaultText
      style={[{ color, fontSize: BASE_SIZE }, style]}
      allowFontScaling={false}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ScrollView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  return <DefaultScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Button(props: ButtonProps) {
  const { lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "button");
  const BASE_SIZE = useContext(SizeContext);

  return (
    <TouchableOpacity hitSlop={{ left: 5, right: 5, top: 5, bottom: 5 }} {...otherProps}>
      <DefaultText style={[{ color, fontSize: BASE_SIZE }]} allowFontScaling={false}>
        {otherProps.title}
      </DefaultText>
    </TouchableOpacity>
  );
}

export const TextInput = forwardRef(function (props: TextInputProps, ref) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "border");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const placeholderTextColor = useThemeColor({}, "inactive");

  return (
    <DefaultTextInput
      ref={ref as unknown as any}
      style={[{ backgroundColor, color: textColor }, style]}
      selectionColor={tintColor}
      placeholderTextColor={placeholderTextColor}
      {...otherProps}
    />
  );
});

export function getToastConfig(theme: "light" | "dark") {
  const backgroundColor = Colors[theme as "light" | "dark"]["background"];
  const textColor = Colors[theme as "light" | "dark"]["text"];

  return {
    success: (props: any) => (
      <SuccessToast
        {...props}
        style={{ backgroundColor, borderLeftColor: "green" }}
        text1Style={{ color: textColor }}
        text2Style={{ color: textColor }}
      />
    ),
    info: (props: any) => (
      <InfoToast
        {...props}
        style={{ backgroundColor, borderLeftColor: "gray" }}
        text1Style={{ color: textColor }}
        text2Style={{ color: textColor }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ backgroundColor, borderLeftColor: "red" }}
        text1Style={{ color: textColor }}
        text2Style={{ color: textColor }}
      />
    ),
  };
}
