import { TimeFormat } from "@hongpung/src/common"
import { Instrument } from "@hongpung/src/entities/instrument"
import { User } from "@hongpung/src/entities/user"
import { z } from "zod";

const ReservationFormSchema = z.object({

    title: z.string(),

    date: z.string().nullable().refine((date) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return date === null || regex.test(date);
    }, { message: "날짜 형식이 올바르지 않습니다. (yyyy-mm-dd)" }),

    startTime: z.string().nullable().refine((time) => {
        const regex = /^(0[0-9]|1[0-2]):[0-5][0-9]$/;
        return time === null || regex.test(time);
    }, { message: "시간 형식이 올바르지 않습니다. (hh:mm)" }),

    endTime: z.string().nullable().refine((time) => {
        const regex = /^(0[0-9]|1[0-2]):[0-5][0-9]$/;
        return time === null || regex.test(time);
    }, { message: "시간 형식이 올바르지 않습니다. (hh:mm)" }),

    reservationType: z.enum(['REGULAR', 'COMMON']),

    participationAvailable: z.boolean(),

    participators: z.array(z.object({
        id: z.number(),
    })),

    borrowInstruments: z.array(z.object({
        id: z.number(),
    })),

});


export type ReservationForm = {

    title: string // 예약 제목

    date?: string // 예약 날짜 yyyy-mm-dd 형식

    startTime?: TimeFormat// 시작 시간 hh:mm 형식
    endTime?: TimeFormat// 시작 시간 hh:mm 형식

    reservationType: Exclude<ReservationType, 'EXTERNAL'>

    participationAvailable: boolean

    participators: User[]

    borrowInstruments: Instrument[]

}