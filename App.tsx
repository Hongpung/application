import { Platform, View, SafeAreaView as SafeView, ViewStyle, StyleProp, Text, ImageBackground, Modal, StyleSheet } from 'react-native';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as SplashScreen from 'expo-splash-screen';

import Toast from 'react-native-toast-message';
import { RecoilRoot } from 'recoil';

import { toastConfig } from './src/common/config/toast.config';
import { useAppLoad } from './hoc/useAppLoad';
import { RootStacks } from './nav/RootStack';
import { Color } from './ColorSet';


const ContentsContainer: React.FC<{ startDomain: "Login" | "Tutorial" | "HomeStack" }> = ({ startDomain }) => {
  return (
    <NavigationContainer>
      <RootStacks startDomain={startDomain} />
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

  const { firstScreen, fontLoaded, banners } = useAppLoad();

  const getLoadingText = () => {
    if (!fontLoaded) return '폰트 로딩중';
    if (!firstScreen) return '기본 정보 로딩중';
    if (banners.state === 'LOADED') return '';
    if (banners.state === 'FAILED') return '배너 로딩 실패';
    return '배너 로딩중';
  };


  if (!fontLoaded || !firstScreen || banners.state != 'LOADED') {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground source={require('./assets/splash.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode='cover'
          onLoadEnd={SplashScreen.hideAsync} />

        <Text style={{ position: 'absolute', bottom: 20, right: 20, color: Color['grey400'], fontFamily: 'NanumSquareNeo-Bold' }}>
          {getLoadingText()}
        </Text>

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

const styles = StyleSheet.create({
  androidStyle: { paddingBottom: 12, backgroundColor: '#FFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }
})