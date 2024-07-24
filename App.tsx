import { StyleSheet, Text, View } from 'react-native';
import { Tutorial } from './components/pages/tutorial'
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
import ExampleScreen from './components/pages/Home';


const RootStack = createNativeStackNavigator<RootStackParamList>();

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
      <RootStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
        <RootStack.Screen name="Tutorial" component={Tutorial} />
        <RootStack.Screen name="Permission" component={Permission} />
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="SignUp" component={SignUp} options={{ headerShown: true, header: () => <Header leftButton='X'/> }} />
        <RootStack.Screen name="Home" component={ExampleScreen}/>
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

const Home: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingLeft: 24, paddingRight: 24 }}>
      <Text>
        여기가 이제 홈이다
      </Text>
    </View>
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
