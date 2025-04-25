import { Platform, View, SafeAreaView as SafeView, ViewStyle, StyleProp, Text, ImageBackground, Modal, StyleSheet } from 'react-native';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as SplashScreen from 'expo-splash-screen';

import Toast from 'react-native-toast-message';
import { RecoilRoot } from 'recoil';

import { toastConfig } from './src/common/config/toast.config';
import { RootStackNavigation } from './src/navigation/RootStackNavigation';
import { Color } from './ColorSet';
import { useFirstPage } from './src/common/lib/useFirstPage';
import { useFonts } from './src/common/lib/useFonts';


const ContentsContainer: React.FC<{ startDomain: "Tutorial" | "Permission" | "LoginStack" | "Main" }> = ({ startDomain }) => {
  return (
    <NavigationContainer>
      <RootStackNavigation startDomain={startDomain} />
    </NavigationContainer>
  )
}

const SafeZone: React.FC<{ children: any, style: StyleProp<ViewStyle> }> = ({ children, style }) => {

  if (Platform.OS == 'android')
    return (
      <SafeAreaView style={[style, Platform.OS === 'android' ? styles.androidStyle : {}]}>
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

  return (
    <RecoilRoot>
      <AppLoader />
    </RecoilRoot>
  )
}

if (Platform.OS == 'android')
  SplashScreen.preventAutoHideAsync();

const AppLoader: React.FC = () => {

  const { firstScreen } = useFirstPage();
  const { fontLoaded } = useFonts();

  const getLoadingText = () => {
    if (!fontLoaded) return '폰트 로딩중';
    if (!firstScreen) return '기본 정보 로딩중';
    return '';
  };


  if (!fontLoaded || !firstScreen ) {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground source={require('./assets/splash.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode='cover'
          onLoadEnd={SplashScreen.hideAsync} />

        <Text style={{ position: 'absolute', bottom: 20, right: 20, color: Color['grey400'], fontFamily: 'NanumSquareNeo-Bold' }}>
          {getLoadingText()}
        </Text>
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

const styles = StyleSheet.create({
  androidStyle: { paddingBottom: 12, backgroundColor: '#FFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }
})