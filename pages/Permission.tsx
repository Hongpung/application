import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color } from '../ColorSet'
import LongButton from '../components/buttons/LongButton';
import { RootStackParamList } from './pageTypes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

type PermissionProps = NativeStackScreenProps<RootStackParamList, "Permission">;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
// 추후 보강

const Permission: React.FC<PermissionProps> = ({ navigation }) => {


  const PermissionHandler = async () => {
    await Notifications.requestPermissionsAsync();
    await Camera.requestCameraPermissionsAsync();
    await MediaLibrary.requestPermissionsAsync();
    
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF", alignItems: 'center' }}>
      <View style={{ height: 80, alignItems: 'center', marginTop: 62 }}>
        <Text style={{ fontSize: 24, height: 40, fontFamily: "NanumSquareNeo-Bold" }}>권한 동의</Text>
        <Text style={{ color: Color["grey400"], fontSize: 14, height: 36, marginTop: 4, fontFamily: "NanumSquare Neo OTF Bold" }}>
          앱 사용시 필요한 권한에 대해 동의하는 단계에요.
        </Text>
      </View>
      <View style={{ marginTop: 80, flex: 1, alignItems: 'center' }}>
        <View style={styles.Card}>
          <View style={styles.CardIcons}>
            {/* 카메라 */}
          </View>
          <View>
            <Text style={styles.CardHeaderWord}>
              카메라 사용 권한
            </Text>
            <Text style={styles.CardDescript}>
              {"QR코드 인식, 이용후 정리 확인 등에\n이용해요"}
            </Text>
          </View>
        </View>
        <View style={styles.Card}>
          <View style={styles.CardIcons}>
            {/* 카메라 */}
          </View>
          <View>
            <Text style={styles.CardHeaderWord}>
              카메라 사용 권한
            </Text>
            <Text style={styles.CardDescript}>
              {"QR코드 인식, 이용후 정리 확인 등에\n이용해요"}
            </Text>
          </View>
        </View>
        <View style={styles.Card}>
          <View style={styles.CardIcons}>
            {/* 카메라 */}
          </View>
          <View>
            <Text style={styles.CardHeaderWord}>
              카메라 사용 권한
            </Text>
            <Text style={styles.CardDescript}>
              {"QR코드 인식, 이용후 정리 확인 등에\n이용해요"}
            </Text>
          </View>
        </View>
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

export default Permission

const styles = StyleSheet.create({
  Card: {
    alignItems: 'center',
    flexDirection: 'row',
    width: 320,
    height: 118,
    borderWidth: 1,
    borderColor: Color["grey200"],
    borderRadius: 10,
    marginBottom: 20
  },
  CardIcons: {
    marginLeft: 32,
    marginRight: 24,
    height: 48,
    width: 48,
    backgroundColor: "#000"
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
    height: 36,
    fontSize: 12,
    lineHeight: 14
  },
  CTA: {
    position: 'absolute',
    bottom: 32
  }
})