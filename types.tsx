/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  PreviewModal: undefined;
  QuoteModal: {
    id: number;
  };
  ReplyModal: {
    postId?: number;
    forumId?: number;
    content?: string;
  };
  SearchModal: undefined;
  Post: {
    id: number;
    title: string;
  };
  LayoutSettings: undefined;
  GeneralSettings: undefined;
  BlackList: undefined;
  BlackListUser: undefined;
  BlackListWord: undefined;
  ForumSettings: undefined;
  About: undefined;
  FooterLayout: undefined;
  Search: {
    query: string;
  };
  Sketch: undefined;
  Recommend: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Home: undefined;
  Favorite: undefined;
  History: undefined;
  Profile: undefined;
  HomeMain: {
    thread?: number;
  };
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type HistoryTabParamList = {
  Browse: undefined;
  Reply: undefined;
};
