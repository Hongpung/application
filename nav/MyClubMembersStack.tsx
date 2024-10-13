import ClubMemeberScreen from "@hongpung/pages/Home/MyClub/ClubMember/ClubMemeberScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from '@hongpung/components/Header';

const MyClubMembersStack = createNativeStackNavigator();

const MyClubMembersStacks = () => {
    return (
        <MyClubMembersStack.Navigator initialRouteName="ClubMembersHome" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <MyClubMembersStack.Screen
                name="ClubMembersHome"
                component={ClubMemeberScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => <Header leftButton='arrow-back' HeaderName='우리 동아리' />
                }}
            />
        </MyClubMembersStack.Navigator>
    );
};


export default MyClubMembersStacks;