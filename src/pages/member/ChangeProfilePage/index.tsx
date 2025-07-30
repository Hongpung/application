import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Color, Header, LongButton, withLoginUser } from "@hongpung/src/common";

import {
  ProfileImageSelector,
  useUpdateProfile,
} from "@hongpung/src/features/member/changeProfile";

import {
  EditPersonalInfoModal,
  EditSNSAddressModal,
  ProfileInfoSection,
  ProfileSNSSection,
} from "@hongpung/src/widgets/member";

const CANT_CHANGE_INFO_TEXT =
  "이름, 동아리, 이메일 등 변경 불가능한 정보는 의장에게 문의해주세요.";

const ChangeProfilePage: React.FC = () => {
  const {
    editPersonalInfo,
    setEditPersonalInfo,
    updateProfile,
    isLoading,
    isChanged,

    //image picker
    pickImageFromAlbum,
    selectedImage,
    selectedImageUri,
    resetImage: pickImageReset,
  } = useUpdateProfile();

  const [isSnsAddressModalVisible, setIsSnsAddressModalVisible] =
    useState(false);
  const [isPersonalInfoModalVisible, setIsPersonalInfoModalVisible] =
    useState(false);

  const resetImage = () => {
    setEditPersonalInfo((prev) => ({
      ...prev,
      profileImageUrl: undefined,
    }));
    pickImageReset();
  };

  useEffect(() => {
    if (!isChanged) return;
    setEditPersonalInfo((prev) => ({
      ...prev,
      profileImageUrl: selectedImageUri ?? undefined,
    }));
  }, [selectedImageUri, isChanged, setEditPersonalInfo]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {isPersonalInfoModalVisible && (
        <EditPersonalInfoModal
          initialValues={{
            nickname: editPersonalInfo.nickname,
            enrollmentNumber: editPersonalInfo.enrollmentNumber,
          }}
          onClose={() => setIsPersonalInfoModalVisible(false)}
          onConfirm={({ nickname, enrollmentNumber }) => {
            setEditPersonalInfo((prev) => ({
              ...prev,
              nickname,
              enrollmentNumber,
            }));
            setIsPersonalInfoModalVisible(false);
          }}
        />
      )}

      {isSnsAddressModalVisible && (
        <EditSNSAddressModal
          initialValues={{
            instagramUrl: editPersonalInfo.instagramUrl,
            blogUrl: editPersonalInfo.blogUrl,
          }}
          onClose={() => setIsSnsAddressModalVisible(false)}
          onConfirm={({ instagramUrl, blogUrl }) => {
            setEditPersonalInfo((prev) => ({
              ...prev,
              instagramUrl,
              blogUrl,
            }));
            setIsSnsAddressModalVisible(false);
          }}
        />
      )}

      <View style={{ flex: 1 }}>
        <Header headerName="프로필 변경" />
        <ScrollView
          bounces={false}
          style={{ flex: 1, backgroundColor: Color["grey100"] }}
          contentContainerStyle={{ flexGrow: 1, gap: 24, paddingTop: 24 }}
        >
          <ProfileImageSelector
            profileImageUrl={editPersonalInfo.profileImageUrl}
            selectedImageUri={selectedImageUri}
            pickImageFromAlbum={pickImageFromAlbum}
            onResetProfileImage={resetImage}
          />

          <ProfileInfoSection
            editPersonalInfo={editPersonalInfo}
            setIsPersonalInfoModalVisible={setIsPersonalInfoModalVisible}
          />

          <ProfileSNSSection
            editPersonalInfo={editPersonalInfo}
            setIsSnsAddressModalVisible={setIsSnsAddressModalVisible}
          />
        </ScrollView>
        <View
          style={{
            paddingTop: 16,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            backgroundColor: Color["white"],
            gap: 12,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: Color["grey300"],
              textAlign: "center",
              fontFamily: "NanumSquareNeo-Bold",
            }}
          >
            {CANT_CHANGE_INFO_TEXT}
          </Text>
          <LongButton
            innerContent={
              isLoading ? <ActivityIndicator color={"white"} /> : "저장하기"
            }
            isAble={isChanged}
            color={"blue"}
            onPress={() => {
              updateProfile(selectedImage);
            }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default withLoginUser(ChangeProfilePage);
