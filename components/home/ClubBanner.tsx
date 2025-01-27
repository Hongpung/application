import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { useRecoilValue } from "recoil";
import { loginUserState } from "@hongpung/recoil/authState";
import { Color } from "@hongpung/ColorSet";
import { MainStackParamList } from "@hongpung/nav/HomeStacks";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import ClubBannerBG from "@hongpung/assets/images/CLUB_BANNER.svg";

type HomeNavProps = NativeStackNavigationProp<MainStackParamList, 'Home'>

export const ClubBanner = () => {
    const navigation = useNavigation<HomeNavProps>()
    const userInformation = useRecoilValue(loginUserState);

    return (
        <TouchableOpacity activeOpacity={0.75}
            style={{
                height: 120,
                backgroundColor: '#FFF',
                borderColor: Color['grey200'],
                borderWidth: 1,
                borderRadius: 10,
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 20,
                overflow: 'hidden',
            }}
            onPress={() => navigation.navigate('MyClub', { screen: 'MyClubHome' })}>
            <Text style={{
                fontSize: 18,
                fontFamily: 'NanumSquareNeo-Bold',
            }}>
                우리 동아리
            </Text>
            <Image source={require('../../assets/images/ClubBanner.png')} style={{ position: 'absolute', top: 0, right:0, zIndex:-1}} />
            {/* <ClubBannerBG style={{ position: 'absolute', top: 0, width: '100%', opacity: 0.85 }} /> */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',zIndex:5 }}>
                <Text style={{
                    alignSelf: 'flex-end',
                    fontSize: 14,
                    fontFamily: 'NanumSquareNeo-Bold',
                    color: Color['grey400']
                }}>
                    다음 일정 | {`2021.09.01`}
                </Text>

                <Text style={{
                    fontSize: 16,
                    fontFamily: 'NanumSquareNeo-Bold',
                    color: Color['grey300']
                }}>
                    {userInformation?.club}
                </Text>


            </View>
        </TouchableOpacity>
    )
}