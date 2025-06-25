import { z } from "zod";

export const editSNSAddressSchema = z.object({
  instagramUrl: z
    .string()
    .transform((v) => (v.length > 0 ? v : undefined))
    .optional(),

  blogUrl: z
    .string()
    .transform((v) => (v.length > 0 ? v : undefined))
    .refine((v) => v === undefined || v.startsWith("https://"), {
      message: "올바른 주소를 입력해주세요.",
    })
    .optional(),
});

export type EditSNSAddressSchema = z.infer<typeof editSNSAddressSchema>;
