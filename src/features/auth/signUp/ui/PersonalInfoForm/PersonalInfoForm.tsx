import {
  ValidationState,
  Selector,
  Icons,
  Color,
  LongButton,
} from "@hongpung/src/common";
import { BasicInput } from "@hongpung/src/common/ui/inputs/InputBaseComponent";
import { clubNames } from "@hongpung/src/entities/club";
import { TextInput, View, Text, Pressable } from "react-native";

interface PersonalInfoFormProps {
  name: string;
  nickname?: string;
  club: ClubName;
  enrollmentNumber: string;
  setName: (name: string) => void;
  setNickname: (nickname: string) => void;
  setClub: (club: ClubName) => void;
  setEnrollmentNumber: (enrollmentNumber: string) => void;
  nameValidation: ValidationState;
  nicknameValidation: ValidationState;
  clubValidation: ValidationState;
  enrollmentNumberValidation: ValidationState;
  validateName: (name: string) => void;
  validateNickname: (nickname: string) => void;
  validateClub: (club: ClubName) => void;
  validateEnrollmentNumber: (enrollmentNumber: string) => void;
  nameRef: React.RefObject<TextInput>;
  nicknameRef: React.RefObject<TextInput>;
  enrollmentNumberRef: React.RefObject<TextInput>;
  isClubOptionsVisible: boolean;
  setIsClubOptionsVisible: (visible: boolean) => void;
  nextStep: () => void;
}

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
    nextStep,
  } = props;
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          zIndex: 1,
          width: "100%",
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
            options={clubNames}
            children={
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Text>{club}</Text>
                <Icons name="chevron-down" size={20} color={Color["gray500"]} />
              </View>
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
      <View style={{ marginTop: 24, width: 300, alignSelf: "center" }}>
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

      <View style={{ marginTop: 24, width: 300, alignSelf: "center" }}>
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
      <LongButton
        innerContent="회원가입 하기"
        onPress={nextStep}
        isAble={
          nameValidation.state === "VALID" &&
          nicknameValidation.state === "VALID" &&
          clubValidation.state === "VALID" &&
          enrollmentNumberValidation.state === "VALID"
        }
        color="green"
      />
    </View>
  );
};
