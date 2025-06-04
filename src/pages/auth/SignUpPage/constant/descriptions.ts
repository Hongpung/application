import { SignUpStep } from "@hongpung/src/features/auth/signUp/model/type";

export const SignUpDescriptions: Record<SignUpStep, string[]> = {
  EmailConfirm: [
    "로그인에 사용할 이메일을 입력해주세요.",
    "이메일은 보유한 이메일만 사용할 수 있어요.",
  ],
  SetPassword: [
    "로그인에 사용할 비밀번호를 입력해주세요.",
    "비밀번호는 영문, 숫자, 특수문자를 포함한\n8~12자로 구성해야 해요.",
    "허용 특수문자: !,@,#,$,%,^,&,+,=",
  ],
  PersonalInfo: [
    "어플리케이션 이용에 쓰일 정보를 입력해주세요.",
    "학번은 입학년도 끝 두 자리를 입력해주세요.",
    "이름은 본명을 입력해주세요.",
    "패명은 선택사항이에요.",
  ],
};
