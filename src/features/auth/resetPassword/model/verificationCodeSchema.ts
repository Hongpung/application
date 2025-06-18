import * as z from "zod";

export const verificationCodeSchema = z.object({
  verificationCode: z.string().length(6, "6자리 숫자를 입력해주세요."),
});

export type VerificationCodeFormData = z.infer<typeof verificationCodeSchema>;
