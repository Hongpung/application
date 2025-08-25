import { z } from "zod";

// TimeFormat 검증 (hh:mm 형식)
const timeFormatSchema = z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
  message: "올바른 시간 형식(hh:mm)을 입력해주세요"
});

// 날짜 검증 (yyyy-mm-dd 형식)
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요"
});

// Member와 Instrument 스키마 (임시로 간단하게)
const memberSchema = z.object({
  memberId: z.number(),
  name: z.string(),
  nickname: z.string().nullable(),
});

const instrumentSchema = z.object({
  instrumentId: z.number(),
  name: z.string(),
  instrumentType: z.string(),
});

export const reservationFormSchema = z.object({
  title: z.string().optional(),
  date: dateSchema.optional().refine((val) => val !== undefined, {
    message: "날짜를 선택해주세요"
  }),
  startTime: timeFormatSchema.optional().refine((val) => val !== undefined, {
    message: "시작 시간을 선택해주세요"
  }),
  endTime: timeFormatSchema.optional().refine((val) => val !== undefined, {
    message: "종료 시간을 선택해주세요"
  }),
  reservationType: z.enum(["REGULAR", "COMMON"], {
    errorMap: () => ({ message: "예약 유형을 선택해주세요" }),
  }),
  participationAvailable: z.boolean(),
  participators: z.array(memberSchema),
  borrowInstruments: z.array(instrumentSchema),
});

// 완전한 예약 폼을 위한 스키마 (모든 필드가 필수)
export const completeReservationFormSchema = reservationFormSchema.extend({
  date: dateSchema,
  startTime: timeFormatSchema,
  endTime: timeFormatSchema,
});

export type ValidReservationForm = z.infer<typeof completeReservationFormSchema>;
