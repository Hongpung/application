import ClubInstrumentsScreen from "@hongpung/pages/Home/MyClub/Instruments/ClubInstrumentsScreen";
import InstrumentEditScreen from "@hongpung/pages/Home/MyClub/Instruments/InstrumentEditScreen";
import InstrumentSpecificScreen from "@hongpung/pages/Home/MyClub/Instruments/InstrumentSpecificScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from '@hongpung/components/common/Header';

import { useRecoilValue } from 'recoil';
import { loginUserState } from '@hongpung/recoil/authState';
import InstrumentCreateScreen from "@hongpung/pages/Home/MyClub/Instruments/InstrumentCreateScreen";


export type ClubInstrumentStackParamList = {
    InstrumentsHome: undefined;
    InstrumentDetail: { instrumentId: number };
    InstrumentCreate: undefined;
    InstrumentEdit: { instrument: string };
};


const InstrumentStack = createNativeStackNavigator<ClubInstrumentStackParamList>();

const InstrumentStacks = () => {
    const userInfo = useRecoilValue(loginUserState)
    return (
        <InstrumentStack.Navigator initialRouteName="InstrumentsHome" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <InstrumentStack.Screen
                name="InstrumentsHome"
                component={ClubInstrumentsScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: ({ navigation }) => {
                        if (userInfo?.role.length == 0)
                            return (<Header leftButton='arrow-back' HeaderName='악기 관리' />)
                        else
                            return (<Header leftButton='arrow-back' HeaderName='악기 관리' RightButton='추가' RightAction={() => navigation.navigate('InstrumentCreate')} />)
                    }
                }}
            />
            <InstrumentStack.Screen
                name="InstrumentSpecific"
                component={InstrumentSpecificScreen}
                options={{
                    headerShown: false,
                    animation: 'none',
                }}
            />
            <InstrumentStack.Screen
                name="InstrumentEdit"
                component={InstrumentEditScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => (
                        <Header
                            leftButton='arrow-back'
                            HeaderName='악기 수정'
                        />
                    )
                }}
            />
            <InstrumentStack.Screen
                name="InstrumentCreate"
                component={InstrumentCreateScreen}
                options={{
                    headerShown: true,
                    animation: 'none',
                    header: () => (
                        <Header
                            leftButton='arrow-back'
                            HeaderName='악기 생성'
                        />
                    )
                }}
            />
        </InstrumentStack.Navigator>
    );
};

export default InstrumentStacks;