import { NoticeParamList } from "@hongpung/src/common/navigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NoticeListPage from "@hongpung/src/pages/notice/NoticeListPage";
import NoticeDetailPage from "@hongpung/src/pages/notice/NoticeDetailPage";

const NoticeStack = createNativeStackNavigator<NoticeParamList>();

export const NoticeStackNavigation = () => {
  return (
    <NoticeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <NoticeStack.Screen name="NoticeList" component={NoticeListPage} />
      <NoticeStack.Screen name="NoticeDetail" component={NoticeDetailPage} />
    </NoticeStack.Navigator>
  );
};
