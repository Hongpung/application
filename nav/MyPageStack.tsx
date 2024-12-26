import MyBadgeScreen from "@hongpung/pages/Home/MyPage/MyBadge/MyBadgeScreen";
import MyPageScreen from "@hongpung/pages/Home/MyPage/MyPageScreen";
import MyPracticesScreen from "@hongpung/pages/Home/MyPage/MyPractices/MyPracticesScreen";
import MySchedulesScreen from "@hongpung/pages/Home/MyPage/MySchedule/MySchedulesScreen";
import LoginSettingScreen from "@hongpung/pages/Setting/LoginSetting";
import NotificationSettingScreen from "@hongpung/pages/Setting/NotificationSetting";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from '@hongpung/components/Header';
import PracticeInfoScreen from "@hongpung/pages/share/ClubPracticeInfoScreen";
import ChangeMyInfoScreen from "@hongpung/pages/Home/MyPage/ChangeMyInfoScreen";
import MyPracticeInfoScreen from "@hongpung/pages/share/MyPracticeInfoScreen";
import ChangePasswordScreen from "@hongpung/pages/Home/MyPage/ChangePassword.screen";


export type MyPageParamList = {
    MyPageHome: undefined
    MySchedules: undefined
    MyPractices: undefined
    NotificationSetting: undefined
    LoginSetting: undefined
    MyPracticeInfo: { sessionId: number }
    ChangePassword: undefined
    ChangeMyInfo: undefined
}

const MyPageStack = createNativeStackNavigator<MyPageParamList>();

const MyPageStacks = () => {
    return (
        <MyPageStack.Navigator initialRouteName="MyPageHome" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <MyPageStack.Screen
                name="MyPageHome"
                component={MyPageScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='close' HeaderName='마이페이지' />
                }}
            />
            <MyPageStack.Screen
                name="MySchedules"
                component={MySchedulesScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='arrow-back' HeaderName='내 일정' />
                }}
            />
            {/* <MyPageStack.Screen
                name="MyBadges"
                component={MyBadgeScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='arrow-back' HeaderName='내 배지' />
                }}
            /> */}
            <MyPageStack.Screen
                name='MyPractices'
                component={MyPracticesScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='내 활동' />
                }}
            />

            <MyPageStack.Screen
                name='MyPracticeInfo'
                component={MyPracticeInfoScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='내 활동' />
                }}
            />
            <MyPageStack.Screen
                name='ChangePassword'
                component={ChangePasswordScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='비밀번호 변경' />
                }}
            />

            <MyPageStack.Screen
                name='ChangeMyInfo'
                component={ChangeMyInfoScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='내 활동' />
                }}
            />

            <MyPageStack.Screen
                name='NotificationSetting'
                component={NotificationSettingScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='알림 설정' />
                }}
            />

            <MyPageStack.Screen
                name='LoginSetting'
                component={LoginSettingScreen}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='로그인 설정' />
                }}
            />

        </MyPageStack.Navigator>
    );
};

export default MyPageStacks;