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
  useRoute,
  useNavigationState,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { PageControlAji } from "react-native-chi-page-control";
import * as Clipboard from "expo-clipboard";

import * as React from "react";
import {
  Alert,
  AppState,
  ColorSchemeName,
  Dimensions,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PreviewModalScreen from "../screens/PreviewModalScreen";
import QuoteModalScreen from "../screens/QuoteModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import BrowseHistoryScreen, {
  UserHistory,
} from "../screens/BrowseHistoryScreen";
import PostScreen from "../screens/PostScreen";
import LayoutSettingsScreen from "../screens/LayoutSettingsScreen";
import DrawerContent from "../components/DrawerContent";
import PostScreenHeaderRight from "../screens/PostScreen/HeaderRight";
import { historyTabAtom, tabRefreshingAtom } from "../atoms";
import {
  HistoryTabParamList,
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { useAtom, useSetAtom } from "jotai";
import Icon from "../components/Icon";
import ReplyModalScreen from "../screens/ReplyModalScreen";
import SearchModalScreen from "../screens/SearchModalScreen";
import { useEffect, useRef } from "react";
import { Post } from "../api";
import { useThemeColor } from "../components/Themed";
import ReplyHistoryScreen from "../screens/ReplyHistoryScreen";
import BlackListScreen from "../screens/BlackListScreen";

const width = Dimensions.get("window").width;

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
  const navigation = useNavigation();

  const onClipboardChange = (
    threadId: string | undefined,
    history: UserHistory[]
  ): void => {
    const shouldShowConfirm =
      threadId &&
      !history
        .slice(0, 5)
        .some((item) => (item as unknown as Post)?.id === Number(threadId));
    if (shouldShowConfirm) {
      showNavigateConfirm(threadId);
    }
  };

  const showNavigateConfirm = (threadId: string) => {
    Alert.alert("检测到串号，是否跳转Po." + threadId, "", [
      { text: "取消" },
      {
        text: "确认",
        onPress: () => {
          navigation.navigate("Post", {
            id: Number(threadId),
            title: `Po.${threadId}`,
          });
        },
      },
    ]);
  };

  useEffect(() => {
    AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        Clipboard.getStringAsync().then(async (text) => {
          const thread = text.match(/http:\/\/bog\.ac\/t\/([0-9]{0,})/);
          const threadId = thread?.[1];
          const history = await AsyncStorage.getItem("history");
          const historyList = JSON.parse(history || "[]");
          onClipboardChange(threadId, historyList);
        });
      }
    });
  }, [appState.current]);

  return (
    <Stack.Navigator
      screenOptions={{
        statusBarAnimation: "fade",
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Post"
        component={PostScreen}
        options={{
          title: "",
          headerRight: PostScreenHeaderRight,
        }}
      />
      <Stack.Screen
        name="LayoutSettings"
        component={LayoutSettingsScreen}
        options={{ title: "显示设置" }}
      />
      <Stack.Screen
        name="BlackList"
        component={BlackListScreen}
        options={{ title: "屏蔽串设置" }}
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

const HistoryTab = createMaterialTopTabNavigator<HistoryTabParamList>();

function HistoryTabNavigator() {
  const setHistoryTab = useSetAtom(historyTabAtom);
  const navigation = useNavigation();
  const index = useNavigationState(
    (state) =>
      state.routes.find((route) => route.name === "History")?.state?.index || 0
  );

  useEffect(() => {
    navigation.setOptions({
      title: ["浏览历史", "发言历史"][index],
    });
    setHistoryTab(index);
  }, [index]);

  return (
    <HistoryTab.Navigator
      initialRouteName="Browse"
      backBehavior="none"
      screenOptions={{
        tabBarContentContainerStyle: {
          display: "none",
        },
        swipeEnabled: true,
      }}
    >
      <HistoryTab.Screen
        name="Browse"
        component={BrowseHistoryScreen}
        options={{ tabBarLabel: "浏览历史" }}
      ></HistoryTab.Screen>
      <HistoryTab.Screen
        name="Reply"
        component={ReplyHistoryScreen}
        options={{ tabBarLabel: "发言历史" }}
      ></HistoryTab.Screen>
    </HistoryTab.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const tintColor = useThemeColor({}, "tint");
  const activeColor = useThemeColor({}, "active");
  const inactiveColor = useThemeColor({}, "inactive");
  const setTabRefreshing = useSetAtom(tabRefreshingAtom);
  const [historyTab] = useAtom(historyTabAtom);

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: tintColor,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={DrawerNavigator}
        options={({ navigation, route }: RootTabScreenProps<"Home">) => ({
          headerShown: false,
          title: "版块",
          tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
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
          tabBarIcon: ({ color }) => <Icon name="heart" color={color} />,
          tabBarLabelStyle,
        }}
      />
      <BottomTab.Screen
        name="History"
        component={HistoryTabNavigator}
        options={{
          title: "历史",
          tabBarIcon: ({ color }) => <Icon name="clock-o" color={color} />,
          tabBarLabelStyle,
          headerRight: () => (
            <PageControlAji
              progress={historyTab}
              numberOfPages={2}
              style={{ marginHorizontal: 10 }}
              activeTintColor={activeColor}
              inactiveTintColor={inactiveColor}
            ></PageControlAji>
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "设置",
          tabBarIcon: ({ color }) => <Icon name="cog" color={color} />,
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
      screenOptions={{
        headerTintColor: "white",
      }}
    >
      <Drawer.Screen
        name="Main"
        component={HomeScreen}
        options={{
          swipeEdgeWidth: width * 0.75,
        }}
      />
    </Drawer.Navigator>
  );
}

const tabBarLabelStyle = {
  marginBottom: 6,
};
