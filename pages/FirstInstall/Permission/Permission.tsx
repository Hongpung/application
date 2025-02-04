import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color } from '@hongpung/ColorSet'
import LongButton from '@hongpung/components/buttons/LongButton';
import { RootStackParamList } from '@hongpung/pageTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import * as Notifications from 'expo-notifications';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icons } from '@hongpung/components/common/Icon';
import { useNavigation } from '@react-navigation/native';

type PermissionProp = NativeStackNavigationProp<RootStackParamList, "Permission">;
// 추후 보강
const PermissionScreen: React.FC = () => {

  const navigation = useNavigation<PermissionProp>();

  const PermissionHandler = async () => {
    if (Platform.OS == 'ios' || (Platform.OS == 'android' && Platform.Version >= 33))
      await Notifications.requestPermissionsAsync();
    await Camera.requestCameraPermissionsAsync();
    await MediaLibrary.requestPermissionsAsync();

    await AsyncStorage.setItem('isLaunched', 'true');

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF", alignItems: 'center' }}>
      <View style={{ height: 80, alignItems: 'center', marginTop: 62 }}>
        <Text style={{ fontSize: 24, height: 40, fontFamily: "NanumSquareNeo-Bold" }}>권한 동의</Text>
        <Text style={{ color: Color["grey400"], fontSize: 14, height: 36, marginTop: 4, fontFamily: 'NanumSquareNeo-Bold' }}>
          앱 사용시 필요한 권한에 대해 동의하는 단계에요.
        </Text>
      </View>
      <View style={{ justifyContent: 'flex-end', width: '100%', paddingHorizontal: 24, flex: 1, gap: 24, paddingVertical: 48 }}>
        <View style={styles.Card}>
          <View style={styles.CardIcons}>
            <Icons name='camera-outline' size={48} color={Color['blue700']}></Icons>
          </View>
          <View style={{ display: 'flex', gap: 4 }}>
            <Text style={styles.CardHeaderWord}>
              카메라 사용 권한
            </Text>
            <Text style={styles.CardDescript}>
              {"- QR코드 인식\n- 이용 후 정리 확인"}
            </Text>
          </View>
        </View>
        <View style={styles.Card}>
          <View style={styles.CardIcons}>
            <Icons name='albums-outline' size={48} color={Color['blue700']}></Icons>
          </View>
          <View style={{ display: 'flex', gap: 4 }}>
            <Text style={styles.CardHeaderWord}>
              갤러리 사용 권한
            </Text>
            <Text style={styles.CardDescript}>
              {"- 프로필 이미지 등록\n- 악기 사진 등록"}
            </Text>
          </View>
        </View>
        {(Platform.OS == 'ios' || (Platform.OS == 'android' && Platform.Version >= 33)) &&
          <View style={styles.Card}>
            <View style={styles.CardIcons}>
              <Icons name='notifications-outline' size={48} color={Color['blue700']}></Icons>
            </View>
            <View style={{ display: 'flex', gap: 4 }}>
              <Text style={styles.CardHeaderWord}>
                알림 사용 권한
              </Text>
              <Text style={styles.CardDescript}>
                {"- 일정 알림\n- 공지사항 알림\n- 예약 알림"}
              </Text>
            </View>
          </View>}
      </View>
      <View style={styles.CTA}>
        <LongButton
          innerText={"허락하기"}
          color={"blue"}
          isAble={true}
          onPress={PermissionHandler}
        />
      </View>
    </View>
  )
}

export default PermissionScreen

const styles = StyleSheet.create({
  Card: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 24,
    marginHorizontal: 24,
    paddingLeft: 24,
    paddingRight: 12,
    height: 118,
    borderWidth: 1,
    borderColor: Color["grey200"],
    borderRadius: 10,
  },
  CardIcons: {
    height: 48,
    width: 48,
  },
  CardHeaderWord: {
    fontFamily: "NanumSquareNeo-ExtraBold",
    color: Color['grey800'],
    fontSize: 18,
    lineHeight: 22
  },
  CardDescript: {
    fontFamily: "NanumSquareNeo-Regular",
    color: Color['grey400'],
    height: 48,
    fontSize: 12,
    lineHeight: 16
  },
  CTA: {
    width: '100%',
    backgroundColor: '#FFF',
    paddingVertical: 32,
  }
})