import { ResetPasswordStep } from "@hongpung/src/features/auth/resetPassword/model/type";

export const ResetPasswordDescriptions: Record<ResetPasswordStep, string[]> = {
  EmailConfirm: [
    "로그인에 사용하는 이메일을 입력해주세요.",
    "가입된 이메일만 사용할 수 있어요.",
  ],
  ResetPassword: [
    "로그인에 사용할 새로운 비밀번호를 입력해주세요.",
    "비밀번호는 영문, 숫자, 특수문자를 포함한\n8~12자로 구성해야 해요.",
    "허용 특수문자: !,@,#,$,%,^,&,+,=",
  ],
};
