/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Clipboard from "expo-clipboard";
import { useAtom, useSetAtom } from "jotai";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Alert, AppState, ColorSchemeName, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LinkingConfiguration from "./LinkingConfiguration";

import {
  historyTabAtom,
  responsiveWidthAtom,
  showTabBarLabelAtom,
  sizeAtom,
  tabRefreshingAtom,
} from "@/atoms";
import DrawerContent from "@/components/DrawerContent";
import { TabBarIcon } from "@/components/Icon";
import { useThemeColor } from "@/components/Themed";
import AboutScreen from "@/screens/AboutScreen";
import BlackListScreen from "@/screens/BlackListScreen";
import BlackListUserScreen from "@/screens/BlackListUserScreen";
import BlackListWordScreen from "@/screens/BlackListWordScreen";
import BrowseHistoryScreen from "@/screens/BrowseHistoryScreen";
import FavoriteScreen from "@/screens/FavoriteScreen";
import FooterLayoutScreen from "@/screens/FooterLayoutScreen";
import ForumSettingsScreen from "@/screens/ForumSettingsScreen";
import GeneralSettingsScreen from "@/screens/GeneralSettingsScreen";
import HomeScreen from "@/screens/HomeScreen";
import LayoutSettingsScreen from "@/screens/LayoutSettingsScreen";
import NotFoundScreen from "@/screens/NotFoundScreen";
import PostScreen from "@/screens/PostScreen";
import PostScreenHeaderRight from "@/screens/PostScreen/HeaderRight";
import PostScreenHeaderTitle from "@/screens/PostScreen/HeaderTitle";
import PreviewModalScreen from "@/screens/PreviewModalScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import QuoteModalScreen from "@/screens/QuoteModalScreen";
import RecommendScreen from "@/screens/RecommendScreen";
import ReplyHistoryScreen from "@/screens/ReplyHistoryScreen";
import ReplyModalScreen from "@/screens/ReplyModalScreen";
import SearchModalScreen from "@/screens/SearchModalScreen";
import SearchScreen from "@/screens/SearchScreen";
import SketchScreen from "@/screens/SketchScreen";
import CheckFavoriteUpdate from "@/tasks/CheckFavoriteUpdate";
import CheckVersionUpdate from "@/tasks/CheckVersionUpdate";
import {
  HistoryTabParamList,
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "@/types";

const headerTitleStyle = Platform.select({
  android: {
    fontSize: 18,
  },
});

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const cardColor = useThemeColor({}, "card");
  const cardTextColor = useThemeColor({}, "cardText");
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={{
        ...theme,
        colors: {
          ...theme.colors,
          card: cardColor,
          text: cardTextColor,
        },
      }}>
      <RootNavigator />
      <CheckFavoriteUpdate />
      <CheckVersionUpdate />
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
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [clipboardText, setClipboardText] = useState("");
  const cardTextColor = useThemeColor({}, "cardText");

  const showNavigateConfirm = (threadId: string) => {
    Alert.alert("??????????????????????????????Po." + threadId, "", [
      { text: "??????" },
      {
        text: "??????",
        onPress: () => {
          navigation.navigate("Root");
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
          if (text && text !== clipboardText) {
            setClipboardText(text);
          }
        });
      }
    });
  }, [appState.current]);

  useEffect(() => {
    if (clipboardText) {
      const thread = clipboardText.match(/http:\/\/bog\.ac\/t\/([0-9]{0,})/);
      const threadId = thread?.[1];
      if (threadId) {
        showNavigateConfirm(threadId);
      }
    }
  }, [clipboardText]);

  return (
    <Stack.Navigator
      screenOptions={{
        animation: "fade_from_bottom",
        headerBackTitle: "??????",
        headerTitleAlign: "center",
        headerTintColor: cardTextColor,
        headerTitleStyle,
      }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="Post"
        component={PostScreen}
        options={({ route, navigation }) => ({
          title: route.params.title || `Po.${route.params.id}`,
          headerTitle: PostScreenHeaderTitle,
          headerRight: () => <PostScreenHeaderRight id={route.params.id} />,
        })}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: "???????????????",
        }}
      />
      <Stack.Screen
        name="LayoutSettings"
        component={LayoutSettingsScreen}
        options={{ title: "????????????" }}
      />
      <Stack.Screen
        name="GeneralSettings"
        component={GeneralSettingsScreen}
        options={{ title: "????????????" }}
      />
      <Stack.Screen
        name="BlackList"
        component={BlackListScreen}
        options={{ title: "???????????????" }}
      />
      <Stack.Screen
        name="BlackListUser"
        component={BlackListUserScreen}
        options={{ title: "??????????????????" }}
      />
      <Stack.Screen
        name="BlackListWord"
        component={BlackListWordScreen}
        options={{ title: "???????????????" }}
      />
      <Stack.Screen
        name="FooterLayout"
        component={FooterLayoutScreen}
        options={{ title: "??????????????????" }}
      />
      <Stack.Screen
        name="ForumSettings"
        component={ForumSettingsScreen}
        options={{ title: "????????????" }}
      />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: "??????" }} />
      <Stack.Screen name="Sketch" component={SketchScreen} options={{ title: "??????" }} />
      <Stack.Screen name="Recommend" component={RecommendScreen} options={{ title: "?????????" }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: "Oops!" }} />
      <Stack.Group
        screenOptions={{
          presentation: Platform.OS === "ios" ? "card" : "transparentModal",
        }}>
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
  const [responsiveWidth] = useAtom(responsiveWidthAtom);
  const setHistoryTab = useSetAtom(historyTabAtom);
  const cardColor = useThemeColor({}, "card");
  const cardActiveColor = useThemeColor({}, "cardActive");
  const cardInactiveColor = useThemeColor({}, "cardInactive");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const index = useNavigationState(
    (state) => state.routes.find((route) => route.name === "History")?.state?.index || 0
  );
  const indicatorWidth = 72;

  useEffect(() => {
    navigation.setOptions({
      title: ["????????????", "????????????"][index],
    });
    setHistoryTab(index);
  }, [index]);

  return (
    <HistoryTab.Navigator
      initialRouteName="Browse"
      backBehavior="none"
      style={{
        paddingTop: insets.top,
        backgroundColor: cardColor,
      }}
      screenOptions={{
        tabBarLabelStyle: Platform.select({
          ios: {
            fontSize: 17,
            fontWeight: "600",
          },
          android: {
            fontSize: 18,
            fontFamily: "sans-serif-medium",
            fontWeight: "normal",
          },
          default: {
            fontSize: 18,
            fontWeight: "500",
          },
        }),
        tabBarIndicatorStyle: {
          backgroundColor: cardActiveColor,
          width: indicatorWidth,
          height: 4,
          borderRadius: 60,
          overflow: "hidden",
          left: responsiveWidth / 4 - indicatorWidth / 2,
        },
        tabBarStyle: {
          shadowColor: "transparent",
          marginBottom: 3,
        },
        tabBarPressColor: cardActiveColor,
        tabBarActiveTintColor: cardActiveColor,
        tabBarInactiveTintColor: cardInactiveColor,
        swipeEnabled: true,
      }}>
      <HistoryTab.Screen
        name="Browse"
        component={BrowseHistoryScreen}
        options={{ tabBarLabel: "????????????" }}
      />
      <HistoryTab.Screen
        name="Reply"
        component={ReplyHistoryScreen}
        options={{ tabBarLabel: "????????????" }}
      />
    </HistoryTab.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const cardActiveColor = useThemeColor({}, "cardActive");
  const insets = useSafeAreaInsets();
  const setTabRefreshing = useSetAtom(tabRefreshingAtom);
  const [BASE_SIZE] = useAtom(sizeAtom);
  const [showTabBarLabel] = useAtom(showTabBarLabelAtom);

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle,
        tabBarActiveTintColor: cardActiveColor,
        tabBarAllowFontScaling: false,
        tabBarLabelPosition: "below-icon",
        tabBarStyle: {
          height: (showTabBarLabel ? BASE_SIZE * 3.8 : BASE_SIZE * 3.5) + insets.bottom,
          paddingTop: showTabBarLabel ? BASE_SIZE * 0.62 : undefined,
          paddingBottom: insets.bottom,
          borderTopWidth: 0,
        },
        tabBarIconStyle: {
          margin: 0,
          height: "auto",
          padding: 0,
        },
        tabBarLabelStyle: {
          marginBottom: BASE_SIZE * 0.4,
          fontSize: BASE_SIZE * 0.7,
          fontWeight: "bold",
          lineHeight: BASE_SIZE * 1.33,
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={DrawerNavigator}
        options={({ navigation, route }: RootTabScreenProps<"Home">) => ({
          headerShown: false,
          title: "??????",
          tabBarShowLabel: showTabBarLabel,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        })}
        listeners={({ navigation, route }) => ({
          tabPress: () => {
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
          title: "??????",
          tabBarLabel: "??????",
          tabBarShowLabel: showTabBarLabel,
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="History"
        component={HistoryTabNavigator}
        options={{
          title: "??????",
          tabBarLabel: "??????",
          tabBarShowLabel: showTabBarLabel,
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="history" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "??????",
          tabBarShowLabel: showTabBarLabel,
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const [responsiveWidth] = useAtom(responsiveWidthAtom);
  const cardTextColor = useThemeColor({}, "cardText");
  return (
    <Drawer.Navigator
      initialRouteName="HomeMain"
      drawerContent={(props) => DrawerContent(props)}
      screenOptions={{
        headerTintColor: cardTextColor,
        headerTitleAlign: "center",
        headerTitleStyle,
      }}>
      <Drawer.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          swipeEdgeWidth: responsiveWidth * 0.75,
          title: "",
          drawerIcon: ({ color }) => <TabBarIcon name="three-bars" color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}
