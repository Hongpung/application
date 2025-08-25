import { useMemo } from "react";
import { type ReservationForm } from "@hongpung/src/entities/reservation";

export type ReservationDifferenceKey =
  | keyof Omit<ReservationForm, "startTime" | "endTime">
  | "time";

// 필드별 비교 전략을 정의
const fieldComparisonStrategies = {
  borrowInstruments: (
    c: ReservationForm["borrowInstruments"],
    p: ReservationForm["borrowInstruments"]
  ) => JSON.stringify(c ?? []) !== JSON.stringify(p ?? []),
  participators: (
    c: ReservationForm["participators"],
    p: ReservationForm["participators"]
  ) => JSON.stringify(c ?? []) !== JSON.stringify(p ?? []),
  title: (c: ReservationForm["title"], p: ReservationForm["title"]) => c !== p,
  date: (c: ReservationForm["date"], p: ReservationForm["date"]) => c !== p,
  reservationType: (
    c: ReservationForm["reservationType"],
    p: ReservationForm["reservationType"]
  ) => c !== p,
  participationAvailable: (
    c: ReservationForm["participationAvailable"],
    p: ReservationForm["participationAvailable"]
  ) => c !== p,
  startTime: (
    c: ReservationForm["startTime"],
    p: ReservationForm["startTime"]
  ) => c !== p,
  endTime: (c: ReservationForm["endTime"], p: ReservationForm["endTime"]) =>
    c !== p,
} satisfies {
  [K in keyof ReservationForm]: (
    c: ReservationForm[K],
    p: ReservationForm[K]
  ) => boolean;
};

const diffKeys = {
    startTime: "time",
    endTime: "time",
    borrowInstruments: "borrowInstruments",
    participators: "participators",
    title: "title",
    date: "date",
    reservationType: "reservationType",
    participationAvailable: "participationAvailable",
} satisfies {
  [K in keyof ReservationForm]: ReservationDifferenceKey;
};


/**
 * 예약 폼의 변경사항을 감지하는 훅
 * @param currentForm 현재 예약 폼
 * @param previousForm 이전 예약 폼
 * @returns 변경된 필드들의 키 배열
 */
export const useReservationDifference = (
  currentForm: ReservationForm | undefined,
  previousForm: ReservationForm | undefined
): ReservationDifferenceKey[] => {
  return useMemo(() => {
    if (!currentForm || !previousForm) return [];

    const diff = new Set<ReservationDifferenceKey>();
        
    // 일반 필드들 비교
    function typedKeys<T extends object>(obj: T): (keyof T)[] {
      return Object.keys(obj) as (keyof T)[];
    }

    typedKeys(fieldComparisonStrategies).forEach((key) => {
      const strategy = fieldComparisonStrategies[key] as (
        c: ReservationForm[typeof key],
        p: ReservationForm[typeof key]
      ) => boolean;
      const currentValue = currentForm[key] as ReservationForm[typeof key];
      const previousValue = previousForm[key] as ReservationForm[typeof key];

      if (strategy(currentValue, previousValue)) {
        diff.add(diffKeys[key]);
      }
    });

    return [...diff];
  }, [currentForm, previousForm]);
};
