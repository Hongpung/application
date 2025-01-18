import { Platform, View, SafeAreaView as SafeView, ViewStyle, StyleProp, Text, Pressable, ActivityIndicator, Image, ImageBackground, Modal, AppState, TouchableOpacity } from 'react-native';
import Tutorial from './pages/FirstInstall/Tutorial/Tutorial';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Permission from './pages/FirstInstall/Permission/Permission';
import LoginScreen from './pages/Auth/Login/LoginScreen';
import SignUpScreen from './pages/Auth/SignUp/SignUpScreen';
import Header from './components/Header';
import MainStacks from './nav/HomeStacks';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SignUpProvider } from '@hongpung/pages/Auth/SignUp/context/SignUpContext';
import { RecoilRoot, useRecoilState } from 'recoil';
import { deleteToken, getToken } from './utils/TokenHandler';
import { bannersState } from './recoil/bannerState';
import * as Notifications from 'expo-notifications';
import PWResetScreen from './pages/Auth/PWReset/PWReset';
import { PasswordResetProvider } from './pages/Auth/PWReset/context/PWResetContext';
import { RootStackParamList } from './pageTypes';
import { toastConfig } from './utils/toast.config';
import { useAuth } from './hoc/useAuth';

const fetchFonts = async () => {
  await Font.loadAsync({
    "NanumSquareNeo-Bold": require("./assets/fonts/NanumSquareNeoOTF-Bd.otf"),
    "NanumSquareNeo-ExtraBold": require("./assets/fonts/NanumSquareNeoOTF-Eb.otf"),
    "NanumSquareNeo-Regular": require("./assets/fonts/NanumSquareNeoOTF-Rg.otf"),
    "NanumSquareNeo-Light": require("./assets/fonts/NanumSquareNeoOTF-Lt.otf"),
    "NanumSquareNeo-Heavy": require("./assets/fonts/NanumSquareNeoOTF-Hv.otf")
  })
}

const ContentsContainer: React.FC<{ startDomain: "Login" | "Tutorial" | "HomeStack" }> = ({ startDomain }) => {
  return (
    <NavigationContainer>
      <RootStacks startDomain={startDomain} />
    </NavigationContainer>
  )
}

const SignUp: React.FC = () => {
  return (
    <SignUpProvider>
      <SignUpScreen />
    </SignUpProvider>
  )

}
const PasswordReset: React.FC = () => {
  return (
    <PasswordResetProvider>
      <PWResetScreen />
    </PasswordResetProvider>
  )

}


const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootStacks: React.FC<{ startDomain: "Login" | "Tutorial" | "HomeStack" }> = ({ startDomain }) => {
  return (
    <RootStack.Navigator initialRouteName={startDomain} screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
      <RootStack.Screen name="Tutorial" component={Tutorial} />
      <RootStack.Screen name="Permission" component={Permission} />
      <RootStack.Screen name="Login" component={LoginScreen} options={{ animation: 'none' }} />
      <RootStack.Screen name="PWReset" component={PasswordReset} options={{ headerShown: true, header: () => <Header leftButton='close' /> }} />
      <RootStack.Screen name="SignUp" component={SignUp} options={{ headerShown: true, header: () => <Header leftButton='close' /> }} />
      <RootStack.Screen name="HomeStack" component={MainStacks} options={{ animation: 'none' }} />
    </RootStack.Navigator>
  )
}

const SafeZone: React.FC<{ children: any, style: StyleProp<ViewStyle> }> = ({ children, style }) => {

  if (Platform.OS == 'android')
    return (
      <SafeAreaView style={[style, { paddingBottom: 12, backgroundColor: '#FFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }]} >
        {children}
      </SafeAreaView>
    )

  return (
    <SafeView style={style}>
      {children}
    </SafeView>
  )
}

const App: React.FC = () => {

  const notificationListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      Toast.show({
        type: 'notification',
        text1: notification.request.content.title || 'fail',
        text2: notification.request.content.body || 'fail',
        position: 'top',
        topOffset: 56,
        visibilityTime: 2000
      });
    });


    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
    };

  }, [])
  return (
    <RecoilRoot>
      <AppLoader />
    </RecoilRoot>
  )
}

interface BannerFetchData {
  bannerId: string
  owner: string
  startDate: string //ISOTimeString
  endDate: string //ISOTimeString
  bannerImgUrl: string
  href?: string
}

const AppLoader: React.FC = () => {

  const [fontLoaded, setFontLoaded] = useState(false);
  const [firstScreen, setFirstScreen] = useState<"Tutorial" | "Login" | "HomeStack" | null>(null);
  const [banners, setBanners] = useRecoilState<{ state: 'BEFORE' | 'PENDING' | 'LOADED' | 'FAILED', value: BannerFetchData[] | null }>(bannersState)

  const { logout } = useAuth()
  const loadFonts = async () => {
    await fetchFonts();
    setFontLoaded(true);
  };

  const firstScreenSetting = async () => {
    const launchFlag = await AsyncStorage.getItem('isLaunched');

    if (!launchFlag) setFirstScreen("Tutorial")
    else {
      const autoLogin = await AsyncStorage.getItem('autoLogin');
      if (autoLogin) {

        const token = null;//await getToken('token');
        if (token) {
          setFirstScreen('HomeStack')
          Toast.show({
            type: 'success',
            text1: '자동 로그인 되었어요' + `(${(new Date().getMonth() + 1).toString().padStart(2, '0')}월${(new Date().getDate()).toString().padStart(2, '0')})일`,
            position: 'bottom',
            bottomOffset: 60,
            visibilityTime: 3000
          });
        }

        else {
          setFirstScreen('Login')
          Toast.show({
            type: 'fail',
            text1: '자동 로그인이 만료되었어요.\n다시 로그인 해주세요.',
            position: 'bottom',
            bottomOffset: 60,
            visibilityTime: 3000
          });
        }
      }
      else setFirstScreen('Login');
    }
  }

  const fetchBanner = async () => {

    setBanners(prev => ({ state: 'PENDING', value: prev.value }))

    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {

      const bannerData = await fetch(`${process.env.SUB_API}/banners/on-post`,
        {
          signal
        }
      )

      if (!bannerData.ok) throw Error();

      const serverData = await bannerData.json() as BannerFetchData[];

      setBanners({ state: 'LOADED', value: serverData })

    } catch (e) {
      console.error(e + '배너 오류');
      setBanners(prev => ({ state: 'FAILED', value: prev.value }))
    } finally {
      clearTimeout(timeoutId);
    }

  };

  const initProcess = async () => {
    try {

      await loadFonts();
      await firstScreenSetting();
      await fetchBanner();

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    initProcess();

    return () => {

      logout();

    }
  }, [])



  if (!fontLoaded || !firstScreen || banners.state != 'LOADED') {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground source={require('./assets/splash.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode='cover'
          onLoadEnd={SplashScreen.hideAsync} />
        <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ActivityIndicator size="large" color={'#FFF'} />
          <Text style={{ position: 'absolute', bottom: 20, right: 20, color: '#FFF', fontFamily: 'NanumSquareNeo-Bold' }}>{fontLoaded ? firstScreen ? banners.state == 'FAILED' ? '' : '배너 로딩중' : '기본 정보 로딩중' : `폰트 로딩중`}</Text>
        </View>
        <Modal visible={banners.state == 'FAILED'} transparent>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <View style={{
              borderRadius: 20,
              minHeight: 200,
              paddingVertical: 24,
              marginHorizontal: 24,
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'red',
              }}>데이터를 불러오는 데 실패했습니다.</Text>
              <Text style={{
                fontSize: 16,
                color: '#333',
              }}>인터넷 연결을 확인 후 앱을 다시 시작해주세요.</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <SafeZone style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ContentsContainer startDomain={firstScreen} />
      <Toast config={toastConfig} />
    </SafeZone>
  );
}

export default App;