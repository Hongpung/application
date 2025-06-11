import { z } from "zod";

export const editPersonalInfoSchema = z.object({
  nickname: z
    .string()
    .transform((v) => (v === "" ? undefined : v))
    .optional()
    .refine((v) => v === undefined || /^[가-힣]+$/.test(v), {
      message: "닉네임은 한글만 입력 가능합니다.",
    }),

  enrollmentNumber: z
    .string()
    .length(2, "학번은 2자여야 합니다.")
    .regex(/^\d{2}$/, "학번은 숫자로만 구성되어야 합니다."),
});

export type EditPersonalInfoSchema = z.infer<typeof editPersonalInfoSchema>;
