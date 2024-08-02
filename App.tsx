import { StyleSheet, Text, View } from 'react-native';
import { Tutorial } from './components/pages/Tutorial'
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './components/pages/pageTypes';
import Permission from './components/pages/Permission';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import Header from './components/Header';
import BottomNav from './components/pages/BottomNav';
import HomeStacks from './components/pages/HomeStacks';



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
      <RootStack.Screen name="Login" component={Login} />
      <RootStack.Screen name="SignUp" component={SignUp} options={{ headerShown: true, header: () => <Header leftButton='X' /> }} />
      <RootStack.Screen name="HomeStack" component={HomeStacks} options={{ animation: 'none'}}/>
    </RootStack.Navigator>
  )
}

const App: React.FC = () => {

  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    const loadFonts = async () => {
      await fetchFonts();
      setFontLoaded(true);
      SplashScreen.hideAsync();
    };

    loadFonts();
  })

  if (!fontLoaded) {
    return null;
  }
  return (
    <View style={{ flex: 1, marginTop: 54, backgroundColor: "#FFFFFF" }}>
      <ContentsContainer />
    </View>
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
