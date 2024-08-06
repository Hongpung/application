import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from '../components/Header';
import NotificationScreen from './NotificationScreen';
import MyPageScreen from './ProfileScreen';
import MySchedulesScreen from './MySchedulesScreen';
import MyBadgeScreen from './MyBadgeScreen';
import BottomNav from './BottomNav';


const HomeStack = createNativeStackNavigator();

const HomeStacks = () => {
    return (
        <HomeStack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' ,}}>
            <HomeStack.Screen name="BottomNav" component={BottomNav} options={{}}/>
            <HomeStack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: true, animation: 'none' ,header: () => <Header leftButton='X' HeaderName='알림' />, }} />
            <HomeStack.Screen name="MyPage" component={MyPageScreen} options={{ headerShown: true, animation: 'none' ,header: () => <Header leftButton='X' HeaderName='마이페이지' /> }} />
            <HomeStack.Screen name="MySchedules" component={MySchedulesScreen} options={{ headerShown: true, animation: 'none' ,header: () => <Header leftButton='<-' HeaderName='내 일정' /> }} />
            <HomeStack.Screen name="MyBadges" component={MyBadgeScreen} options={{ headerShown: true, animation: 'none' ,header: () => <Header leftButton='<-' HeaderName='내 배지' /> }} />
        </HomeStack.Navigator>
    );
}

export default HomeStacks;