import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Color } from '../../ColorSet';
import CustomSwitch from '../../components/CustomSwitch';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const LoginSettingScreen: React.FC = () => {

    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {

    }, []);

    return (
        <GestureHandlerRootView>
            <View>
                <View style={{ height: 24 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 36, justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey700'], fontSize: 16 }}>자동 로그인 설정</Text>
                    <CustomSwitch
                        onChange={setIsEnabled}
                        value={isEnabled}
                    />
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

export default LoginSettingScreen

const styles = StyleSheet.create({})