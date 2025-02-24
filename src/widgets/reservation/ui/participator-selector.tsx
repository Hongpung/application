import { Color, Icons } from "@hongpung/src/common"
import { User } from "@hongpung/src/entities/user"
import { View, Text, Pressable, Image } from "react-native"

type ParticipantsSelectorProps = {
    participators: User[]
    onPress: () => void
    resetParticipator: () => void
}

export const ParticipantsSelector: React.FC<ParticipantsSelectorProps> = ({ participators, onPress, resetParticipator }) => {
    
    return (
        <View>
            <View style={{ marginHorizontal: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>참여자</Text>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
                        onPress={resetParticipator}>
                        <Icons name='refresh' size={16} color={Color['grey400']} />
                        <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey300'] }}>초기화</Text>
                    </Pressable>
                </View>

                <View style={{ height: 16 }} />

                <Pressable style={{ marginHorizontal: 16 }}
                    onPress={onPress}>
                    {participators.length > 0 ?
                        <View style={{ justifyContent: 'flex-end', borderRadius: 10, height: 72, backgroundColor: Color['grey200'] }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', flex: 1, marginLeft: 24, bottom: 8 }}>
                                    {participators.slice(0, 4).map(user => (user.profileImageUrl ?
                                        <Image source={{ uri: user.profileImageUrl }} style={{ width: 42, height: 56, }} /> : <View style={{ width: 42, height: 56, backgroundColor: Color['grey300'], borderWidth: 0.5, marginLeft: -6 * Math.min(participators.length, 4), borderRadius: 5 }} />))}
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', flex: 1, bottom: 12, gap: 8, paddingHorizontal: 12 }}>

                                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey400'] }} numberOfLines={1}>
                                        {participators.slice(0, 2).map(user => `${user.name}`).filter(Boolean).join(', ')}{participators.length >= 3 && `등`}
                                    </Text>

                                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Bold', color: Color['blue500'] }}>
                                            {participators.length}
                                        </Text>
                                        <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey700'] }}>
                                            {` 명`}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        :
                        <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 4, height: 72, borderColor: Color['grey200'], borderStyle: 'dashed' }}>
                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'] }}>+</Text>
                        </View>
                    }
                </Pressable>
            </View>
        </View>
    )
    
}