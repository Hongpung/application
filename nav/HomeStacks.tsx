import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from '../components/Header';
import NotificationScreen from '../pages/NotificationScreen';
import MyPageScreen from '../pages/MyPageScreen';
import MySchedulesScreen from '../pages/MySchedulesScreen';
import MyBadgeScreen from '../pages/MyBadgeScreen';
import BottomNav from './BottomNav';
import MyClubScreen from '../pages/MyClubScreen';
import ClubMemeberScreen from '../pages/ClubMemeberScreen';
import ClubInstrumentsScreen from '../pages/ClubInstrumentsScreen';
import InstrumentSpecificScreen from '../pages/InstrumentSpecificScreen';
import InstrumentEditScreen from '../pages/InstrumentEditScreen';
import { InstrumentProvider, useInstrument } from '../context/InstrumentContext';


const HomeStack = createNativeStackNavigator();


const HomeStacks = () => {

    return (
        <InstrumentProvider>
            <HomeStack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right', }}>
                <HomeStack.Screen name="BottomNav" component={BottomNav} options={{}} />
                <HomeStack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: true, animation: 'none', header: () => <Header leftButton='X' HeaderName='알림' />, }} />
                <HomeStack.Screen name="MyPage" component={MyPageScreen} options={{ headerShown: true, animation: 'none', header: () => <Header leftButton='X' HeaderName='마이페이지' /> }} />
                <HomeStack.Screen name="MySchedules" component={MySchedulesScreen} options={{ headerShown: true, animation: 'none', header: () => <Header leftButton='<-' HeaderName='내 일정' /> }} />
                <HomeStack.Screen name="MyBadges" component={MyBadgeScreen} options={{ headerShown: true, animation: 'none', header: () => <Header leftButton='<-' HeaderName='내 배지' /> }} />
                <HomeStack.Screen name="MyClub" component={MyClubScreen} options={{ headerShown: true, animation: 'none', header: () => <Header leftButton='<-' HeaderName='우리 동아리' /> }} />
                <HomeStack.Screen name="ClubMembers" component={ClubMemeberScreen} options={{ headerShown: true, animation: 'none', header: () => <Header leftButton='<-' HeaderName='동아리원' /> }} />
                <HomeStack.Screen name="ClubInstruments" component={ClubInstrumentsScreen} options={{ headerShown: true, animation: 'none', header: () => <Header leftButton='<-' HeaderName='악기 관리' /> }} />
                <HomeStack.Screen name="InstrumentSpecific" component={InstrumentSpecificScreen} options={({ navigation }) => ({
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header
                        leftButton='X'
                        HeaderName='악기 상세'
                        RightButton='수정'
                        RightAction={() => navigation.push('InstrumentEdit')}
                        addLeftAction={() => {
                            const { setSelectedInstrument } = useInstrument()
                            setSelectedInstrument(null);
                        }}
                    />
                })} />
                <HomeStack.Screen name="InstrumentEdit" component={InstrumentEditScreen} options={({ navigation }) => ({
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header
                        leftButton='<-'
                        HeaderName='악기 수정'
                        RightButton='저장'
                        RightAction={() => navigation.goBack()} // 네비게이션 동작 추가
                    />
                })} />
            </HomeStack.Navigator>
        </InstrumentProvider>
    );
}

export default HomeStacks;