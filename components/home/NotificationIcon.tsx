import useFetchUsingToken from "@hongpung/src/common/hooks/useFetchUsingToken"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { Pressable, View, StyleSheet } from "react-native"
import { Icons } from "../../src/common/components/Icons/Icon"
import { Color } from "@hongpung/ColorSet"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { MainStackParamList } from "@hongpung/nav/HomeStacks"

type HomeNavProps = NativeStackNavigationProp<MainStackParamList, 'Home'>

export const NotificationIcon = () => {

    const isFocusing = useIsFocused()
    const navigation = useNavigation<HomeNavProps>()

    const { data: isNotRead } = useFetchUsingToken<{ status: boolean }>(`${process.env.EXPO_PUBLIC_BASE_URL}/notification/notRead`, {}, 5000, [isFocusing])

    return (
        <Pressable
            style={styles.icons}
            onPress={() => { navigation.navigate('Notification'); }}>
            <Icons size={28} name={'notifications'} color={Color['grey400']} />
            {isNotRead?.status &&
                <View style={{ position: 'absolute', width: 12, height: 12, backgroundColor: Color['red400'], borderWidth:2, borderColor:'#FFF', bottom: 4, right: 4, borderRadius: 100 }} />
            }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    icons: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
    }
})