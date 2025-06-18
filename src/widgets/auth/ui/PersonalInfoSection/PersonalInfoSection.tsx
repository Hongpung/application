import { View } from "react-native";
import { DescriptionBox } from "@hongpung/src/common";
import { StepProps } from "@hongpung/react-step-flow";
import { SignUpStepPropsList } from "@hongpung/src/features/auth/signUp/model/type";
import { PersonalInfoForm } from "@hongpung/src/features/auth/signUp";

type CreateNewPasswordSectionProps = StepProps<
  SignUpStepPropsList,
  "PersonalInfo"
>;

const PersonalInfoSection: React.FC<CreateNewPasswordSectionProps> = (
  props,
) => {
  const descriptions = [
    "어플리케이션 이용에 쓰일 정보를 입력해주세요.",
    "학번은 입학년도 끝 두 자리를 입력해주세요.",
    "이름은 본명을 입력해주세요.",
    "패명은 선택사항이에요.",
  ];

  return (
    <View style={{ flex: 1 }}>
      <DescriptionBox descriptions={descriptions} />
      <PersonalInfoForm {...props} />
    </View>
  );
};

export default PersonalInfoSection;
