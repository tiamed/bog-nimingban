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
  useTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Clipboard from "expo-clipboard";
import { useAtom, useSetAtom } from "jotai";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Alert, AppState, ColorSchemeName, Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LinkingConfiguration from "./LinkingConfiguration";

import { historyTabAtom, showTabBarLabelAtom, sizeAtom, tabRefreshingAtom } from "@/atoms";
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

const width = Dimensions.get("window").width;

const headerTitleStyle = Platform.select({
  android: {
    fontSize: 18,
  },
});

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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

  const showNavigateConfirm = (threadId: string) => {
    Alert.alert("检测到串号，是否跳转Po." + threadId, "", [
      { text: "取消" },
      {
        text: "确认",
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
        headerBackTitle: "返回",
        headerTitleAlign: "center",
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
          title: "搜索结果：",
        }}
      />
      <Stack.Screen
        name="LayoutSettings"
        component={LayoutSettingsScreen}
        options={{ title: "显示设置" }}
      />
      <Stack.Screen
        name="GeneralSettings"
        component={GeneralSettingsScreen}
        options={{ title: "通用设置" }}
      />
      <Stack.Screen
        name="BlackList"
        component={BlackListScreen}
        options={{ title: "屏蔽串设置" }}
      />
      <Stack.Screen
        name="BlackListUser"
        component={BlackListUserScreen}
        options={{ title: "屏蔽饼干设置" }}
      />
      <Stack.Screen
        name="BlackListWord"
        component={BlackListWordScreen}
        options={{ title: "屏蔽词设置" }}
      />
      <Stack.Screen
        name="FooterLayout"
        component={FooterLayoutScreen}
        options={{ title: "底栏按钮设置" }}
      />
      <Stack.Screen
        name="ForumSettings"
        component={ForumSettingsScreen}
        options={{ title: "版块管理" }}
      />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: "关于" }} />
      <Stack.Screen name="Sketch" component={SketchScreen} options={{ title: "涂鸦" }} />
      <Stack.Screen name="Recommend" component={RecommendScreen} options={{ title: "推荐串" }} />
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
  const setHistoryTab = useSetAtom(historyTabAtom);
  const activeColor = useThemeColor({}, "active");
  const inactiveColor = useThemeColor({}, "tabInactive");
  const { colors } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const index = useNavigationState(
    (state) => state.routes.find((route) => route.name === "History")?.state?.index || 0
  );
  const indicatorWidth = 72;

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
      style={{
        paddingTop: insets.top,
        backgroundColor: colors.card,
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
          backgroundColor: activeColor,
          width: indicatorWidth,
          height: 4,
          borderRadius: 60,
          overflow: "hidden",
          left: width / 4 - indicatorWidth / 2,
        },
        tabBarStyle: {
          shadowColor: "transparent",
        },
        tabBarPressColor: activeColor,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        swipeEnabled: true,
      }}>
      <HistoryTab.Screen
        name="Browse"
        component={BrowseHistoryScreen}
        options={{ tabBarLabel: "浏览历史" }}
      />
      <HistoryTab.Screen
        name="Reply"
        component={ReplyHistoryScreen}
        options={{ tabBarLabel: "发言历史" }}
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
  const tintColor = useThemeColor({}, "tint");
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
        tabBarActiveTintColor: tintColor,
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
          title: "版块",
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
          title: "收藏",
          tabBarLabel: "收藏",
          tabBarShowLabel: showTabBarLabel,
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="History"
        component={HistoryTabNavigator}
        options={{
          title: "历史",
          tabBarLabel: "历史",
          tabBarShowLabel: showTabBarLabel,
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="history" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "设置",
          tabBarShowLabel: showTabBarLabel,
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const textColor = useThemeColor({}, "text");
  return (
    <Drawer.Navigator
      initialRouteName="HomeMain"
      drawerContent={(props) => DrawerContent(props)}
      screenOptions={{
        headerTintColor: textColor,
        headerTitleAlign: "center",
        headerTitleStyle,
      }}>
      <Drawer.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          swipeEdgeWidth: width * 0.75,
          title: "",
          drawerIcon: ({ color }) => <TabBarIcon name="three-bars" color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}
