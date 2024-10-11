import { Platform, StyleSheet, View, SafeAreaView as SafeView, ViewStyle, StyleProp, Text, Pressable, ActivityIndicator, Image, ImageBackground } from 'react-native';
import Tutorial from './pages/FirstInstall/Tutorial/Tutorial';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Permission from './pages/FirstInstall/Permission/Permission';
import LoginScreen from './pages/Auth/Login/LoginScreen';
import SignUpScreen from './pages/Auth/SignUp/SignUpScreen';
import Header from './components/Header';
import MainStacks from './nav/HomeStacks';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { Color } from '@hongpung/ColorSet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SignUpProvider } from '@hongpung/pages/Auth/SignUp/context/SignUpContext';
import { RecoilRoot } from 'recoil';
import { deleteToken, getToken } from './utils/TokenHandler';


const RootStack = createNativeStackNavigator();

const fetchFonts = async () => {
  await Font.loadAsync({
    "NanumSquareNeo-Bold": require("./assets/fonts/NanumSquareNeoOTF-Bd.otf"),
    "NanumSquareNeo-ExtraBold": require("./assets/fonts/NanumSquareNeoOTF-Eb.otf"),
    "NanumSquareNeo-Regular": require("./assets/fonts/NanumSquareNeoOTF-Rg.otf"),
    "NanumSquareNeo-Light": require("./assets/fonts/NanumSquareNeoOTF-Lt.otf"),
    "NanumSquareNeo-Heavy": require("./assets/fonts/NanumSquareNeoOTF-Hv.otf")
  })
}

const toastConfig = {
  successHasReturn: ({ text1, text2, ...rest }: BaseToastProps) => (//success 및 되돌리기 버튼 포함
    <View style={{ width: '100%' }}>
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          paddingVertical: 12,
          borderRadius: 50,
          paddingHorizontal: 24,
          marginHorizontal: 24,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        {...rest}
      >
        <View>
          <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold', maxWidth: '100%', fontFamily: "NanumSquareNeo-Bold" }}>
            {text1}
          </Text>
        </View>

        <Pressable
          style={{
            paddingHorizontal: 4,
            paddingVertical: 5,
            borderRadius: 5,
          }}
          onPress={() => {
            console.log('Undo action');
            Toast.hide();
          }}
        >
          <Text style={{ fontSize: 14, color: Color['blue500'], fontFamily: "NanumSquareNeo-Bold" }}>되돌리기</Text>
        </Pressable>
      </View>
    </View>
  ),
  success: ({ text1, text2, ...rest }: BaseToastProps) => (//success시 알림 모양
    <View style={{ width: '100%' }}>
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          paddingVertical: 12,
          borderRadius: 50,
          paddingHorizontal: 24,
          marginHorizontal: 48,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        {...rest}
      >
        <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold', fontFamily: "NanumSquareNeo-Bold", textAlign: 'center' }}>
          {text1}
        </Text>
      </View>
    </View>
  ),
  fail: ({ text1, text2, ...rest }: BaseToastProps) => (//fail 시 알림 모양
    <View style={{ width: '100%' }}>
      <View
        style={{
          backgroundColor: 'rgba(242,107,87,0.8)',
          paddingVertical: 12,
          borderRadius: 50,
          paddingHorizontal: 24,
          marginHorizontal: 48,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        {...rest}
      >
        <Text style={{ color: '#FFF', fontSize: 14, fontFamily: "NanumSquareNeo-Bold", textAlign: 'center', lineHeight:20 }}>
          {text1}
        </Text>
      </View>
    </View>
  ),
};


const ContentsContainer: React.FC<{ startDomain: string }> = ({ startDomain }) => {
  return (
    <NavigationContainer>
      <RootStacks startDomain={startDomain} />
    </NavigationContainer>
  )
}

const SignUp: React.FC<{ navigation: any, route: any }> = () => {
  return (
    <SignUpProvider>
      <SignUpScreen />
    </SignUpProvider>
  )

}

const RootStacks: React.FC<{ startDomain: string }> = ({ startDomain }) => {
  return (
    <RootStack.Navigator initialRouteName={startDomain} screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
      <RootStack.Screen name="Tutorial" component={Tutorial} />
      <RootStack.Screen name="Permission" component={Permission} />
      <RootStack.Screen name="Login" component={LoginScreen} options={{ animation: 'none' }} />
      <RootStack.Screen name="SignUp" component={SignUp} options={{ headerShown: true, header: () => <Header leftButton='close' /> }} />
      <RootStack.Screen name="HomeStack" component={MainStacks} options={{ animation: 'none' }} />
    </RootStack.Navigator>
  )
}

const App: React.FC = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [firstScreen, setFirstScreen] = useState<"Tutorial" | "Login" | "HomeStack" | null>(null);

  const loadFonts = async () => {
    await fetchFonts();
    setFontLoaded(true);
  };

  const FirstScreenSetting = async () => {
    const launchFlag = await AsyncStorage.getItem('isLaunched');

    if (!launchFlag) setFirstScreen("Tutorial")
    else {
      const autoLogin = await AsyncStorage.getItem('autoLogin');
      if (autoLogin) {

        const token = await getToken('token');
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

  useEffect(() => {

    const loadResources = async () => {
      try {

        await loadFonts();
        await FirstScreenSetting();

      } catch (error) {
        console.error(error);
      }
    };

    loadResources();

    return () => {
      const Logout = async () => {
        try {
          const autoLogin = await AsyncStorage.getItem('autoLogin')
          if (!autoLogin)
            await deleteToken('token');

        } catch (e) {
          console.log(e)
        }
      }

      Logout();

    }
  }, [])



  const SafeZone: React.FC<{ children: any, style: StyleProp<ViewStyle> }> = ({ children, style }) => {

    if (Platform.OS == 'android')
      return (
        <SafeAreaView style={[style]} >
          {children}
        </SafeAreaView>
      )

    return (
      <SafeView style={style}>
        {children}
      </SafeView>
    )
  }

  if (!fontLoaded || !firstScreen) {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground source={require('./assets/splash.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode='cover'
          onLoadEnd={SplashScreen.hideAsync} />
        <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ActivityIndicator size="large" color={'#FFF'} />
          <Text style={{ position: 'absolute', bottom: 20, right: 20, color: '#FFF', fontFamily: 'NanumSquareNeo-Bold' }}>{fontLoaded ? firstScreen ? '' : '기본 정보 로딩중' : `폰트 로딩중`}</Text>
        </View>
      </View>
    );
  }

  return (
    <RecoilRoot>
      <SafeZone style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <ContentsContainer startDomain={firstScreen} />
        <Toast config={toastConfig} />
      </SafeZone>
    </RecoilRoot>
  );
}

export default App;