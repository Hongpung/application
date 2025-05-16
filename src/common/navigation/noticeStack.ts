import { RouteProp } from "@react-navigation/native";
import { MainStackNavigationProp } from "./mainStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type NoticeParamList = {
  NoticeList: undefined;
  NoticeDetail: { noticeId: number };
};

export type NoticeStackProps<T extends keyof NoticeParamList> = {
  navigation: MainStackNavigationProp &
    NativeStackNavigationProp<NoticeParamList, T>;
  route: RouteProp<NoticeParamList, T>;
};
