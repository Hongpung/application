import { z } from "zod";

// Zod 스키마 정의
export const passwordSchema = z
    .string()
    .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
    .max(12, { message: "비밀번호는 최대 12자까지 가능합니다." })
    .regex(/^[A-Za-z\d@$!%*?&]+$/, {
        message: "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.",
    });