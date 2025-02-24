import { Pressable, StyleSheet } from "react-native";
import { Icons } from "../../src/common/components/icons/Icon";
import { Color } from "@hongpung/ColorSet";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "@hongpung/nav/HomeStacks";
import { useNavigation } from "@react-navigation/native";


type HomeNavProps = NativeStackNavigationProp<MainStackParamList, 'Home'>

export const ProfileIcon = () => {

    const navigation = useNavigation<HomeNavProps>()

    return (
        <Pressable
            style={styles.icons}
            onPress={() => { navigation.navigate('MyPage', { screen: 'MyPageHome' }); }}>
            <Icons size={32} name={'person'} color={Color['blue500']} />
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