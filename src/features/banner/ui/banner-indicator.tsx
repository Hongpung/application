import { View, Text, Pressable } from "react-native"
import { Icons } from "@hongpung/src/common"
import { Color } from "@hongpung/ColorSet"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { MainStackParamList } from "@hongpung/nav/HomeStacks"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"


type BannerNavParams = NativeStackNavigationProp<MainStackParamList, 'Home'>

const BannerIndicator: React.FC<{ bannerIdx: number, bannerMass: number, }> = ({ bannerIdx, bannerMass }) => {

    const navigation = useNavigation<BannerNavParams>()

    return (
        <View style={{ position: 'absolute', backgroundColor: Color['grey600'], bottom: 8, right: 8, borderRadius: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 2, height: 20, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: '#FFF', minWidth: 42, fontSize: 12, textAlignVertical: 'center', textAlign: 'right' }}>{bannerIdx < 9 ? '0' + (bannerIdx + 1) : bannerIdx + 1}/{bannerMass! < 10 ? '0' + bannerMass : bannerMass}</Text>
                <Pressable onPress={() => navigation.navigate('Banners')} style={{ justifyContent: 'flex-end', height: 16, width: 64, gap: 4, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: '#FFF', fontSize: 11, textAlign: 'center' }}>모두보기</Text>
                    <Icons name='chevron-forward-outline' color={Color['grey400']} size={12}></Icons>
                </Pressable>
            </View>
        </View>
    )
}

export default BannerIndicator;