import { instrumentTypes } from "@hongpung/src/entities/instrument";
import { z } from "zod";

export const instrumentCreateFormSchema = z.object({
  name: z.string().min(1, { message: "악기 이름을 입력해주세요." }),

  instrumentType: z
    .enum(instrumentTypes as [InstrumentType, ...InstrumentType[]])
    .nullable()
    .refine((val) => instrumentTypes.includes(val as InstrumentType), {
      message: "악기 종류를 선택해주세요.",
    }),

  selectedImage: z
    .instanceof(File, {
      message: "이미지를 선택해주세요.",
    })
    .nullable(),
});

export type InstrumentCreateForm = z.infer<typeof instrumentCreateFormSchema>;
