/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Clipboard from "expo-clipboard";

import * as React from "react";
import { AppState, ColorSchemeName, Platform, Pressable } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import PreviewModalScreen from "../screens/PreviewModalScreen";
import QuoteModalScreen from "../screens/QuoteModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import HistoryScreen from "../screens/HistoryScreen";
import PostScreen from "../screens/PostScreen";
import DrawerContent from "../components/DrawerContent";
import { tabRefreshingAtom } from "../atoms";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { useAtom, useSetAtom } from "jotai";
import TabBarIcon from "../components/TabBarIcon";
import ReplyModalScreen from "../screens/ReplyModalScreen";
import SearchModalScreen from "../screens/SearchModalScreen";
import { useEffect, useRef, useState } from "react";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const appState = useRef(AppState.currentState);
  const [lastCopy, setLastCopy] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        Clipboard.getStringAsync().then((text) => {
          if (text !== lastCopy) {
            const thread = text.match(/http:\/\/bog\.ac\/t\/([0-9]{0,})/);
            if (thread?.[1]) {
              navigation.navigate("Post", {
                id: Number(thread?.[1]),
                title: `Po.${thread?.[1]}`,
              });
              setLastCopy(text);
            }
          }
        });
      }
    });
  }, [appState.current]);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Post"
        component={PostScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group
        screenOptions={{
          presentation: Platform.OS === "ios" ? "card" : "transparentModal",
        }}
      >
        <Stack.Screen
          name="PreviewModal"
          component={PreviewModalScreen}
          options={{
            animation: "fade_from_bottom",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="QuoteModal"
          component={QuoteModalScreen}
          options={{
            animation: "fade_from_bottom",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ReplyModal"
          component={ReplyModalScreen}
          options={{
            animation: "fade_from_bottom",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SearchModal"
          component={SearchModalScreen}
          options={{
            animation: "fade_from_bottom",
            headerShown: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const setTabRefreshing = useSetAtom(tabRefreshingAtom);

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={DrawerNavigator}
        options={({ navigation, route }: RootTabScreenProps<"Home">) => ({
          headerShown: false,
          title: "版块",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          tabBarLabelStyle,
        })}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              setTabRefreshing(true);
            }
          },
        })}
      />
      <BottomTab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          title: "收藏",
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
          tabBarLabelStyle,
        }}
      />
      <BottomTab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "历史",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="clock-o" color={color} />
          ),
          tabBarLabelStyle,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "设置",
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
          tabBarLabelStyle,
        }}
      />
    </BottomTab.Navigator>
  );
}

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={(props) => DrawerContent(props)}
    >
      <Drawer.Screen
        name="Main"
        component={HomeScreen}
        options={{
          // title,
          swipeEdgeWidth: 80,
        }}
      />
    </Drawer.Navigator>
  );
}

const tabBarLabelStyle = {
  marginBottom: 6,
};