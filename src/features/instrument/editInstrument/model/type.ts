import { instrumentTypes } from "@hongpung/src/entities/instrument";
import { z } from "zod";

export const instrumentEditFormSchema = z.object({
  instrumentId: z
    .number({ message: "악기 아이디가 유효하지 않아요." })
    .min(1, { message: "악기 아이디가 유효하지 않아요." }),

  name: z.string().min(1, { message: "악기 이름을 입력해주세요." }),

  instrumentType: z
    .enum(instrumentTypes as [InstrumentType, ...InstrumentType[]])
    .refine((val) => instrumentTypes.includes(val as InstrumentType), {
      message: "악기 종류를 선택해주세요.",
    }),

  selectedImage: z
    .instanceof(File, {
      message: "이미지를 선택해주세요.",
    })
    .nullable(),

  borrowAvailable: z.boolean(),
});

export type InstrumentEditForm = z.infer<typeof instrumentEditFormSchema>;
