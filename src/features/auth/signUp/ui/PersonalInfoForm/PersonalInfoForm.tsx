import { View, Pressable } from "react-native";

import {
  Selector,
  LongButton,
  ErrorModal,
  FullScreenLoadingModal,
  BasicInput,
} from "@hongpung/src/common";

import { clubNames } from "@hongpung/src/entities/club";

import { ClubSelectorLabel } from "../ClubSelectorLabel/ClubSelctorLabel";
import { SignUpStepPropsList } from "../../model/type";
import { StepProps } from "@hongpung/react-step-flow";

type PersonalInfoFormProps = StepProps<SignUpStepPropsList, "PersonalInfo">;

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  stepProps: props,
}) => {
  const {
    nameRef,
    nicknameRef,
    enrollmentNumberRef,
    getField,
    isClubOptionsVisible,
    setIsClubOptionsVisible,
    isCanSignUp,
    signUp,
    isSignUpPending,
  } = props;

  return (
    <View style={{ flex: 1 }}>
      <FullScreenLoadingModal isLoading={isSignUpPending} />
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
              visible={isClubOptionsVisible}
              setVisible={setIsClubOptionsVisible}
              trigger={Pressable}
              color="green"
              options={clubNames}
              {...getField("club")}
            >
              <ClubSelectorLabel
                onPress={() => setIsClubOptionsVisible(true)}
                {...getField("club")}
              />
            </Selector>
          </View>
          <View style={{ flex: 1 }}>
            <BasicInput
              ref={enrollmentNumberRef}
              label="학번"
              requireMark={true}
              color={"green"}
              isRequired
              keyboardType="number-pad"
              maxLength={2}
              {...getField("enrollmentNumber")}
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
            requireMark={true}
            {...getField("name")}
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
            isEditible={true}
            isRequired={false}
            {...getField("nickname")}
          />
        </View>
      </View>
      <View style={{ paddingHorizontal: 12 }}>
        <LongButton
          innerContent="회원가입 하기"
          onPress={() => signUp({ onError: () => {
           
          }})}
          isAble={
            isCanSignUp
          }
          color="green"
        />
      </View>
    </View>
  );
};

export default PersonalInfoForm;
