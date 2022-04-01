/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { useContext } from "react";
import {
  Text as DefaultText,
  View as DefaultView,
  ScrollView as DefaultScrollView,
  Button as DefaultButton,
  TouchableOpacity,
} from "react-native";
import {
  SuccessToast,
  InfoToast,
  ErrorToast,
} from "react-native-toast-message";

import Colors from "../constants/Colors";
import { ColorSchemeContext } from "./ThemeContextProvider";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useContext(ColorSchemeContext);
  const colorFromProps = props[theme as "light" | "dark"];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme as "light" | "dark"][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type ScrollViewProps = ThemeProps & DefaultScrollView["props"];
export type ButtonProps = ThemeProps &
  DefaultButton["props"] &
  DefaultView["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ScrollView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultScrollView style={[{ backgroundColor }, style]} {...otherProps} />
  );
}

export function Button(props: ButtonProps) {
  const { lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "button");

  return (
    <TouchableOpacity {...otherProps}>
      <DefaultText style={[{ color, fontSize: 14 }]}>
        {otherProps.title}
      </DefaultText>
    </TouchableOpacity>
  );
}

export function getToastConfig(theme: "light" | "dark") {
  const backgroundColor = Colors[theme as "light" | "dark"]["background"];
  const textColor = Colors[theme as "light" | "dark"]["text"];
  const borderColor = Colors[theme as "light" | "dark"]["border"];

  return {
    success: (props: any) => (
      <SuccessToast
        {...props}
        style={{ backgroundColor, borderLeftColor: "green" }}
        text1Style={{ color: textColor }}
        text2Style={{ color: borderColor }}
      ></SuccessToast>
    ),
    info: (props: any) => (
      <InfoToast
        {...props}
        style={{ backgroundColor, borderLeftColor: "gray" }}
        text1Style={{ color: textColor }}
        text2Style={{ color: borderColor }}
      ></InfoToast>
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ backgroundColor, borderLeftColor: "red" }}
        text1Style={{ color: textColor }}
        text2Style={{ color: borderColor }}
      ></ErrorToast>
    ),
  };
}
