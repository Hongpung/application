import { useEffect, useState } from "react";
import { View, Text, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Alert, Pressable, Modal, ActivityIndicator } from "react-native"
import Toast from "react-native-toast-message";
import { useRecoilState, useRecoilValue } from "recoil"
import * as ImagePicker from 'expo-image-picker';
import { getToken } from "@hongpung/utils/TokenHandler";
import uploadImage from "@hongpung/utils/uploadImage";
import { useNavigation } from "@react-navigation/native";
import InputComponent from "@hongpung/components/inputs/InputComponent";
import { Color } from "@hongpung/ColorSet";
import LongButton from "@hongpung/components/buttons/LongButton";
import { Icons } from "@hongpung/components/common/Icon";
import { loginUserState } from "@hongpung/recoil/authState"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MyPageParamList } from "@hongpung/nav/MyPageStack";
import useFetchUsingToken from "@hongpung/hoc/useFetchUsingToken";
import { User } from "@hongpung/UserType";

const showApplyCompleteToast = () => {
    Toast.show({
        type: 'success',
        text1: '프로필 수정을 완료했어요!',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 2000
    });
};

type ChangeMyInfoNav = NativeStackNavigationProp<MyPageParamList, 'ChangeMyInfo'>

const ChangeMyInfoScreen: React.FC = () => {
    const navigation = useNavigation<ChangeMyInfoNav>()
    const [isLoading, setLoading] = useState(false);

    const [userData, setLoginUser] = useRecoilState(loginUserState);
    const [nickname, setNickname] = useState(userData?.nickname || '');
    const [instagramUrl, setInstagramUrl] = useState(userData?.instagramUrl||'');
    const [blogUrl, setBlogUrl] = useState(userData?.blogUrl||'');

    const [selectedImage, setImageFile] = useState<File | null>(null);
    const [selectedImageUri, setImageUri] = useState<string | null>(null);


    const RoleTextRender = () => {
        if (userData?.role && userData?.role.length > 0) { return [...userData.role] }

        return ["동아리원"]
    }

    const pickImageFromAlbum = async () => {
        // 권한 요청
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('권한 필요', '앨범 접근 권한이 필요합니다.');
            return;
        }

        // 앨범에서 이미지 선택
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true, // 선택 후 편집 가능
            aspect: [300, 200], // 편집 비율 설정 (4:3)
            quality: 0.5, // 이미지 품질 설정 (0 ~ 1)
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            const imageName = imageUri.split('/').pop();
            const imageType = `image/${imageName?.split('.').pop()}`; // MIME 타입 추정

            const imageFile = {
                uri: imageUri,
                name: imageName,
                type: imageType,
            } as unknown as File;

            console.log(imageFile)
            setImageUri(imageUri);
            setImageFile(imageFile); // 선택된 이미지의 URI 저장
        }
    };

    const ApplyHandler = () => {
        const applyUserStatus = async () => {

            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            try {
                if (!userData) throw Error('userData is not exist')

                setLoading(true)

                const token = await getToken('token');

                if (!token) throw Error('invalid Token');

                const submitForm: { [key: string]: string | null } = {}

                if (userData?.instagramUrl != instagramUrl)
                    submitForm.instagramUrl = instagramUrl.length == 0 ? null : instagramUrl;


                if (userData?.blogUrl != blogUrl)
                    submitForm.blogUrl = blogUrl.length == 0 ? null : blogUrl

                if (userData.nickname != nickname)
                    submitForm.nickname = nickname;

                if (!!selectedImage) {
                    console.log('이미지 업로드 수행중')
                    const uploadRespone = await uploadImage(selectedImage, 'profilePhoto')

                    if (!uploadRespone) throw Error('업로드 실패')

                    console.log('이미지 업로드 수행완료')
                    const { imageUrl } = uploadRespone;
                    submitForm.profileImageUrl = imageUrl;
                }

                console.log('유저 정보 업데이트중', submitForm)

                const response = await fetch(`${process.env.SUB_API}/member/my-status`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(submitForm),
                    signal
                })

                console.log('유저 정보 업데이트')
                if (!response.ok) {
                    throw Error('Server Error' + response.status)
                }

                const userStatus = await response.json() as User;
                setLoginUser(userStatus);

                showApplyCompleteToast();
                navigation.goBack();
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.error('Request was canceled' + err.status);
                } else {
                    console.error(err.message + ' ' + err.status);
                }
                Alert.alert('오류가 발생했습니다.' + err)
            } finally {
                clearTimeout(timeoutId);
                setLoading(false)
            }
        }

        applyUserStatus();
    }

    if (!userData)
        return (
            <View>
                <Text>오류 발생</Text>
            </View>
        )
    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }} >
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FFF" }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
                <Modal visible={isLoading} transparent={true}>
                    <View style={{ flex: 1, zIndex: 5, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator color={'white'} size={'large'} />
                    </View>
                </Modal>
                <View style={{ flex: 1, backgroundColor: "#FFF", display: 'flex', flexDirection: 'column', gap: 24, paddingVertical: 12 }}>
                    <View style={{ position: 'relative', alignSelf: 'center' }}>
                        {selectedImageUri || userData.profileImageUrl ?
                            <View style={{
                                borderRadius: 5,
                                width: 120,
                                height: 160,
                                overflow: 'hidden'
                            }}>
                                <Pressable style={{ position: 'absolute', bottom: 0, width: 120, paddingVertical: 12, backgroundColor: Color['blue200'], zIndex: 2 }}
                                    onPress={pickImageFromAlbum}>
                                    <Text style={{ color: '#FFF', fontFamily: "NanumSquareNeo-Bold", fontSize: 16, textAlign: 'center' }}>사진 변경</Text>
                                </Pressable>
                                <Image source={{ uri: selectedImageUri || userData.profileImageUrl }} style={{
                                    width: 120,
                                    height: 160,
                                    marginRight: 16
                                }} />
                            </View>
                            :
                            <Pressable style={{
                                width: 120,
                                height: 160,
                                borderRadius: 5,
                                marginRight: 16,
                                backgroundColor: Color['grey200'],
                                borderWidth: 1,
                                borderColor: Color['grey300'],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                                onPress={pickImageFromAlbum}>
                                <Icons name="add" size={48} color={Color['grey300']}></Icons>
                            </Pressable>}
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', marginHorizontal: 28, justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>이름</Text>
                            <Text style={{ fontSize: 16, color: Color['grey700'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }}>{userData.name}</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', marginHorizontal: 28, justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>동아리(학번)</Text>
                            <Text style={{ fontSize: 16, color: Color['grey700'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'right' }}>{`${userData.club == '신명화랑' ? '신명화랑' : userData.club}` + `(${userData.enrollmentNumber})`}</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', marginHorizontal: 28, justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left' }}>역할</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 2 }}>
                                {Array.from(RoleTextRender()).map(role => (
                                    <Text key={role} style={{ fontSize: 16, fontFamily: "NanumSquareNeo-Bold", textAlign: 'right', color: role == 'SANGSOE' ? Color['red500'] : Color['blue500'], }}>{role}</Text>
                                ))}
                            </View>


                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', marginHorizontal: 28, justifyContent: 'space-between' }}>
                            <Text style={{
                                fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left'
                            }}>
                                패명
                            </Text>
                            <TextInput
                                value={nickname}
                                onChangeText={setNickname}
                                style={{ fontSize: 16, fontFamily: "NanumSquareNeo-Regular", textAlign: 'right', width: 160, borderBottomWidth: 0.5, paddingVertical: 2, paddingHorizontal: 2 }} />
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', marginHorizontal: 28, justifyContent: 'space-between' }}>
                            <Text style={{
                                fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left'
                            }}>
                                인스타 주소
                            </Text>
                            <TextInput
                                value={instagramUrl}
                                onChangeText={setInstagramUrl}
                                style={{ fontSize: 16, fontFamily: "NanumSquareNeo-Regular", textAlign: 'right', width: 160, borderBottomWidth: 0.5, paddingVertical: 2, paddingHorizontal: 2 }} />
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', marginHorizontal: 28, justifyContent: 'space-between' }}>
                            <Text style={{
                                fontSize: 16, color: Color['grey400'], fontFamily: "NanumSquareNeo-Regular", textAlign: 'left'
                            }}>
                                블로그 주소
                            </Text>
                            <TextInput
                                value={blogUrl}
                                onChangeText={setBlogUrl}
                                style={{ fontSize: 16, fontFamily: "NanumSquareNeo-Regular", textAlign: 'right', width: 160, borderBottomWidth: 0.5, paddingVertical: 2, paddingHorizontal: 2 }} />
                        </View>
                    </View>
                </View>
                <View style={{ position: 'absolute', bottom: 24, width: '100%' }}>
                    <LongButton color="green" innerText="적용하기" isAble={true} onPress={ApplyHandler}>

                    </LongButton>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default ChangeMyInfoScreen

