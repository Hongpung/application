import { z } from "zod";

// Zod 스키마 정의
export const withdrawalSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "현재 비밀번호를 입력해주세요.")
    .min(8, "비밀번호는 8자 이상이어야 합니다."),

  confirmword: z
    .string()
    .min(1, "탈퇴 확인 문자를 입력해주세요.")
    .regex(/탈퇴하기/, "탈퇴 확인 문자를 정확히 입력해주세요."),
});

export type WithdrawalFormData = z.infer<typeof withdrawalSchema>;
