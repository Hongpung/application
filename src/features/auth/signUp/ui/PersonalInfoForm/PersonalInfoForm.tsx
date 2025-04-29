import {
  Selector,
  LongButton,
  ErrorModal,
} from "@hongpung/src/common";
import { BasicInput } from "@hongpung/src/common/ui/inputs/BasicInput";
import { clubNames } from "@hongpung/src/entities/club";
import { View, Pressable } from "react-native";
import { ClubSelectorLabel } from "./ClubSelctorLabel";
import { FullScreenLoadingModal } from "@hongpung/src/common/ui/LoadingModal/FullScreenLoadingModal";
import { PersonalInfoFormProps } from "../../model/type";

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = (props) => {
  const {
    name,
    setName,
    nickname,
    setNickname,
    club,
    setClub,
    enrollmentNumber,
    setEnrollmentNumber,
    nameValidation,
    nicknameValidation,
    enrollmentNumberValidation,
    validateName,
    validateNickname,
    validateEnrollmentNumber,
    nameRef,
    nicknameRef,
    enrollmentNumberRef,
    isClubOptionsVisible,
    setIsClubOptionsVisible,
    clubValidation,
    signUp,
    isSignUpError,
    isSignUpLoading,
  } = props;

  return (
    <View style={{ flex: 1 }}>
      <ErrorModal
        visible={!!isSignUpError}
        title="오류"
        message={
          "회원가입에 실패했어요\n다시 시도해주세요.\n에러코드: " +
          isSignUpError?.message
        }
      />
      <FullScreenLoadingModal isLoading={isSignUpLoading} />
      <View style={{ flex: 1, gap: 28, width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            zIndex: 1,
            gap: 12,
            paddingHorizontal: 48,
            alignSelf: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Selector
              label={"동아리"}
              value={club}
              onChange={setClub}
              visible={isClubOptionsVisible}
              setVisible={setIsClubOptionsVisible}
              trigger={Pressable}
              color="green"
              options={clubNames}
              children={
                <ClubSelectorLabel
                  onPress={() => setIsClubOptionsVisible(true)}
                  value={club}
                  isErrored={clubValidation.state === "ERROR"}
                  errorText={
                    clubValidation.state === "ERROR"
                      ? clubValidation.errorText
                      : ""
                  }
                />
              }
            />
          </View>
          <View style={{ flex: 1 }}>
            <BasicInput
              ref={enrollmentNumberRef}
              label="학번"
              requireMark={true}
              inputValue={enrollmentNumber ?? ""}
              setInputValue={setEnrollmentNumber}
              color={"green"}
              onBlur={() => validateEnrollmentNumber(enrollmentNumber)}
              validationCondition={enrollmentNumberValidation}
              isRequired
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 48,
          }}
        >
          <BasicInput
            ref={nameRef}
            label="이름(본명)"
            color={"green"}
            inputValue={name}
            requireMark={true}
            setInputValue={setName}
            validationCondition={nameValidation}
            onBlur={() => validateName(name)}
          />
        </View>

        <View
          style={{
            paddingHorizontal: 48,
          }}
        >
          <BasicInput
            ref={nicknameRef}
            label="패명"
            color={"green"}
            inputValue={nickname ?? ""}
            setInputValue={setNickname}
            isEditible={true}
            isRequired={false}
            onBlur={() => validateNickname(nickname || "")}
            validationCondition={nicknameValidation}
          />
        </View>
      </View>
      <View style={{ paddingHorizontal: 12  }}>
        <LongButton
          innerContent="회원가입 하기"
          onPress={signUp}
          isAble={
            nameValidation.state === "VALID" &&
            nicknameValidation.state === "VALID" &&
            clubValidation.state === "VALID" &&
            enrollmentNumberValidation.state === "VALID"
          }
          color="green"
        />
      </View>
    </View>
  );
};
