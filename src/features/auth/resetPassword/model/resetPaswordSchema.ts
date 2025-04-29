import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("올바른 이메일 형식이 아닙니다."),

    newPassword: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다."
      ),

    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),

  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
