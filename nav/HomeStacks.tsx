import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Header from '@hongpung/components/common/Header';

//screens
import NotificationScreen from '@hongpung/pages/Home/Notification/NotificationScreen';
import UsingManageScreen from '@hongpung/pages/Home/UsingManageScreen';
// import ChatMediaViewerScreen from '@hongpung/_unused/Chat/ChatMediaViewerScreen';
import CheckInScreen from '@hongpung/pages/QRScan/CheckInScreen';
import CheckOutScreen from '@hongpung/pages/QRScan/CheckOutScreen';
import CheckOutDescriptScreen from '@hongpung/pages/QRScan/CheckOutDescriptScreen';
import CheckOutCameraScreen from '@hongpung/pages/QRScan/CheckOutCameraScreen';
import PictureCheckScreen from '@hongpung/pages/QRScan/PictureCheckScreen';
import CheckOutEndScreen from '@hongpung/pages/QRScan/CheckOutEndScreen';
// import ChatScreen from '@hongpung/_unused/Chat/ChatScreen';

//nav
import BottomTab from './BottomNav';
import MyClubStacks, { MyClubStackStackParamList } from './MyClubStack';
import ReservationStacks, { ReservationStackParamList } from './ReservationStack';
import MyPageStacks, { MyPageParamList } from './MyPageStack';
// import ExtraActivitiesStacks from './ExtraActivitiesStack';
import BannersScreen from '@hongpung/pages/Home/Banners/BannersScreen';
import NoticesPage from '@hongpung/pages/Home/Notices/NoticesPage';
import NoticeDetailPage from '@hongpung/pages/Home/Notices/NoticeDetailPage';

import { View } from 'react-native';
import WebView from 'react-native-webview';
import { WebViewScreen } from '@hongpung/pages/share/WebViewScreen';

export type ScreenParams<StackParamList> = {
    [K in keyof StackParamList]: StackParamList[K] extends undefined
    ? { screen: K }
    : { screen: K; params: StackParamList[K] }
}[keyof StackParamList];

export type MainStackParamList = {
    Home: undefined;
    WebView: { url: string, title?: string };
    QRScan: undefined;

    BottomTab: undefined;

    Notification: undefined; // Home은 파라미터가 없음
    UsingManage: undefined;
    Banners: undefined;

    CheckIn: undefined; // 예시로 Profile 화면에 userId가 필요하다고 가정    

    MyPage: ScreenParams<MyPageParamList>
    MyClub: ScreenParams<MyClubStackStackParamList>
    Reservation: ScreenParams<ReservationStackParamList>
    CheckOut: undefined

    NoticeStack?: ScreenParams<NoticeStackParamList>;
    // ChatRoomStack?: ScreenParams<ChatStackParamList>;

    ExtraActivities: undefined
};

const MainStack = createNativeStackNavigator<MainStackParamList>();

const MainStacks = () => {
    return (
        <MainStack.Navigator initialRouteName="BottomTab" screenOptions={{ headerShown: false, animationDuration: 50, animation: 'slide_from_right' }}>

            <MainStack.Screen name="BottomTab" component={BottomTab} />

            <MainStack.Screen
                name="WebView"
                component={WebViewScreen}
            />

            <MainStack.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                    headerShown: true,
                    animation: 'slide_from_bottom',
                    header: () => <View style={{ paddingVertical: 8, backgroundColor: '#FFF' }}><Header leftButton='close' HeaderName='알림' /></View>,
                    presentation: 'modal'
                }}
            />

            <MainStack.Screen
                name="MyPage"
                component={MyPageStacks}
            />


            <MainStack.Screen
                name="MyClub"
                component={MyClubStacks}
            />


            <MainStack.Screen
                name="Banners"
                component={BannersScreen}
                options={{
                    animationDuration: 200,
                    headerShown: true,
                    animation: 'slide_from_bottom',
                    presentation: 'containedTransparentModal',
                    header: () => <Header leftButton='close' HeaderName='이벤트 및 홍보' />,
                }}
            />

            <MainStack.Screen
                name="NoticeStack"
                component={NoticeStacks}
            />



            <MainStack.Screen
                name="Reservation"
                component={ReservationStacks}
                options={{
                    animation: 'none',
                }} />

            <MainStack.Screen
                name='CheckIn'
                component={CheckInScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='arrow-back' />
                }}
            />

            {/* 대여 중 반납 화면 */}
            <MainStack.Screen
                name='UsingManage'
                component={UsingManageScreen}
                options={{
                    headerShown: true,
                    animation: 'slide_from_bottom',
                    header: () => <Header leftButton='close' HeaderName='현재 정보' />,
                    presentation: 'modal'
                }}
            />

            {/* <MainStack.Screen
                name="ChatRoomStack"
                component={ChatStacks}
                options={{
                    animation: 'none',
                }}
            /> */}

            <MainStack.Screen
                name='CheckOut'
                component={CheckOutStacks}
                options={{
                    animation: 'none',
                }}
            />

            {/* <MainStack.Screen
                name='ExtraActivities'
                component={ExtraActivitiesStacks}
            /> */}


        </MainStack.Navigator>
    );
};


export type NoticeStackParamList = {
    Notices: undefined;
    NoticeDetail: { noticeId: number }
};

const NoticeStack = createNativeStackNavigator<NoticeStackParamList>();

const NoticeStacks = () => {
    return (
        <NoticeStack.Navigator initialRouteName="Notices" screenOptions={{ headerShown: false, animationDuration: 50, animation: 'slide_from_right' }}>
            <NoticeStack.Screen
                name='Notices'
                component={NoticesPage}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='close' HeaderName='공지사항' />,
                }}
            />

            <NoticeStack.Screen
                name="NoticeDetail"
                component={NoticeDetailPage}
                options={{
                    headerShown: true,
                    header: () => <Header leftButton='arrow-back' HeaderName='공지사항' />,
                }}
            />
        </NoticeStack.Navigator>
    )
}

// export type ChatStackParamList = {
//     ChatRoom: { roomId: number, roomName: string };
//     ChatViewer: { images: { user: string, id: string, uri: string, originHeight: number, originWidth: number }[], selectedImgId: string }
// };

// const ChatStack = createNativeStackNavigator<ChatStackParamList>();

// const ChatStacks = () => {
//     return (
//         <ChatStack.Navigator screenOptions={{ headerShown: false, animationDuration: 50, animation: 'slide_from_right' }}>
//             {/* <ChatStack.Screen
//                 name="ChatRoom"
//                 component={ChatScreen}
//                 options={{
//                     animation: 'none',
//                 }}
//             /> */}

//             <ChatStack.Screen
//                 name='ChatViewer'
//                 component={ChatMediaViewerScreen}
//                 options={{
//                     animationDuration: 100,
//                 }}
//             />
//         </ChatStack.Navigator>
//     )
// }


export type CheckOutStackParamList = {
    CheckOutStart: undefined;
    CheckOutDescript: undefined;
    CheckOutCamera: undefined;
    PictureCheck: { photos: { uri: string, originHeight: number, originWidth: number }[] };
    CheckOutEnd: undefined;
};

const CheckOutStack = createNativeStackNavigator<CheckOutStackParamList>();

const CheckOutStacks = () => {
    return (
        <CheckOutStack.Navigator initialRouteName="CheckOutStart" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <CheckOutStack.Screen
                name='CheckOutStart'
                component={CheckOutScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='arrow-back' />
                }}
            />

            <CheckOutStack.Screen
                name='CheckOutDescript'
                component={CheckOutDescriptScreen}
            />

            <CheckOutStack.Screen
                name='CheckOutCamera'
                component={CheckOutCameraScreen}
            />

            <CheckOutStack.Screen
                name='PictureCheck'
                component={PictureCheckScreen}
            />
            <CheckOutStack.Screen
                name='CheckOutEnd'
                component={CheckOutEndScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: ({ navigation }) => <Header leftButton='close' LeftAction={() => navigation.navigate('Home')} />
                }}
            />
        </CheckOutStack.Navigator>
    );
};


export default MainStacks;
