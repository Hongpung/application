import { Platform, StyleSheet, View, SafeAreaView as SafeView, ViewStyle, StyleProp, Text, Pressable, ActivityIndicator, Image, ImageBackground } from 'react-native';
import Tutorial from './pages/Auth/Tutorial';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Permission from './pages/Auth/Permission';
import LoginScreen from './pages/Auth/LoginScreen';
import SignUp from './pages/Auth/SignUp';
import Header from './components/Header';
import MainStacks from './nav/HomeStacks';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { Color } from './ColorSet';
import { AuthProvider } from './context/AuthContext';


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
  success_return: ({ text1, text2, ...rest }: BaseToastProps) => (
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
  success: ({ text1, text2, ...rest }: BaseToastProps) => (
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

};


const ContentsContainer: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStacks />
    </NavigationContainer>
  )
}


const RootStacks: React.FC = () => {
  return (
    <RootStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
      <RootStack.Screen name="Tutorial" component={Tutorial} />
      <RootStack.Screen name="Permission" component={Permission} />
      <RootStack.Screen name="Login" component={LoginScreen} options={{ animation: 'none' }} />
      <RootStack.Screen name="SignUp" component={SignUp} options={{ headerShown: true, header: () => <Header leftButton='X' /> }} />
      <RootStack.Screen name="HomeStack" component={MainStacks} options={{ animation: 'none' }} />
    </RootStack.Navigator>
  )
}

SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {

  const [fontLoaded, setFontLoaded] = useState(false);
  const [loginLoaded, setLoginLoaded] = useState(false);


  useEffect(() => {

    const loadFonts = async () => {
      await fetchFonts();
      setFontLoaded(true);
    };
    const loadLoginData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      setLoginLoaded(true)
    }

    const loadResources = async () => {
      try {

        await loadFonts();

        await loadLoginData();

      } catch (error) {
        console.error(error);
      }
    };

    loadResources();
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
  if (!fontLoaded || !loginLoaded) {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground source={require('./assets/splash.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode='cover'
          onLoadEnd={SplashScreen.hideAsync} />
        <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ActivityIndicator size="large" color={'#FFF'} />
          <Text style={{ position: 'absolute', bottom: 16, right: 20, color: '#FFF', fontFamily: 'NanumSquareNeo-Bold' }}>{fontLoaded ? loginLoaded ? '' : '로그인 로딩중' : `폰트 로딩중`}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeZone style={{ flex: 1, backgroundColor: "#FFFFFF", }}>
      <AuthProvider>
        <ContentsContainer />
        <Toast config={toastConfig} />
      </AuthProvider>
    </SafeZone>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    marginLeft: 24,
    marginRight: 24,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
