import { View, Text, Pressable } from "react-native"
import { Icons } from "@hongpung/src/common"
import { Color } from "@hongpung/src/common"

const BannerIndicator: React.FC<{ bannerIndex: number, bannerLength: number, onPress: () => void }> = ({ bannerIndex, bannerLength, onPress }) => {

    return (
        <View style={{ position: 'absolute', backgroundColor: Color['grey600'], bottom: 8, right: 8, borderRadius: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 2, height: 20, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: '#FFF', minWidth: 42, fontSize: 12, textAlignVertical: 'center', textAlign: 'right' }}>{bannerIndex < 9 ? '0' + (bannerIndex + 1) : bannerIndex + 1}/{bannerLength! < 10 ? '0' + bannerLength : bannerLength}</Text>
                <Pressable onPress={onPress} style={{ justifyContent: 'flex-end', height: 16, width: 64, gap: 4, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: '#FFF', fontSize: 11, textAlign: 'center' }}>모두보기</Text>
                    <Icons name='chevron-forward-outline' color={Color['grey400']} size={12}></Icons>
                </Pressable>
            </View>
        </View>
    )
}

export default BannerIndicator;