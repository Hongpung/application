import { StyleSheet, Text, View } from 'react-native';
import { Tutorial } from './components/pages/tutorial'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './components/pages/pageTypes';


const RootStack = createNativeStackNavigator<RootStackParamList>();

const ContentsContainer:React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Tutorial" screenOptions={{ headerShown: false, animationDuration: 100 ,animation: 'slide_from_right'}}>
        <RootStack.Screen name="Tutorial" component={Tutorial} initialParams={{ Step: 1 }} />
        <RootStack.Screen name="Home" component={Home} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

const Home:React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingLeft: 24, paddingRight: 24 }}>
      <Text>
        여기가 이제 홈이다
      </Text>
    </View>
  )
}

const App:React.FC=() => {
  return (
    <View style={{ flex: 1, marginTop: 54 }}>
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
