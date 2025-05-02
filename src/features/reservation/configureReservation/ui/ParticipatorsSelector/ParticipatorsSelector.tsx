import { View, Text, Pressable } from "react-native"

import { Color, Icons } from "@hongpung/src/common"

import { Member } from "@hongpung/src/entities/member"

import { ParticipatorsViewer } from "@hongpung/src/entities/reservation"

type ParticipatorsSelectorProps = {
    participators: Member[]
    onPress: () => void
    resetParticipator: () => void
}

export const ParticipatorsSelector: React.FC<ParticipatorsSelectorProps> = ({ participators, onPress, resetParticipator }) => {

    return (
        <View>
            <View style={{ marginHorizontal: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>참여자</Text>
                    {resetParticipator &&
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
                            onPress={resetParticipator}>
                            <Icons name='refresh' size={16} color={Color['grey400']} />
                            <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey300'] }}>초기화</Text>
                        </Pressable>}
                </View>

                <View style={{ height: 16 }} />

                <Pressable style={{ marginHorizontal: 16 }} onPress={onPress}>
                    {participators.length > 0 ?
                        <ParticipatorsViewer participators={participators} />
                        :
                        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, borderRadius: 10, borderWidth: 4, height: 72, borderColor: Color['grey200'], borderStyle: 'dashed' }}>
                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'] }}>+</Text>
                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'] }}>참여자 추가하기</Text>
                        </View>
                    }
                </Pressable>
            </View>
        </View>
    )

}