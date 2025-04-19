import { clubNames } from "@hongpung/src/entities/club";
import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("올바른 이메일 형식이 아닙니다."),

    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다."
      ),

    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),

    name: z
      .string()
      .min(2, "이름은 2자 이상이어야 합니다.")
      .max(7, "이름은 7자 이하여야 합니다.")
      .regex(/^[가-힣]+$/, "이름은 한글만 입력 가능합니다."),

    nickname: z
      .string()
      .regex(/^[가-힣]+$/, "닉네임은 한글만 입력 가능합니다.")
      .optional(),

    club: z.string().refine((val) => {
      return clubNames.includes(val as ClubName);
    }, "유효하지 않은 동아리입니다."),

    enrollmentNumber: z
      .string()
      .length(2, "학번은 2자여야 합니다.")
      .regex(/^\d{2}$/, "학번은 숫자로만 구성되어야 합니다.")
      .transform((val) => Number(val)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
