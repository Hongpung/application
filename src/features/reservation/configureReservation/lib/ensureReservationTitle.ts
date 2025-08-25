import { type ReservationForm } from "@hongpung/src/entities/reservation";

// title이 비어있거나 공백만 있을 때 기본 제목을 생성하는 내부 함수
const createDefaultTitle = (userName?: string | null, userNickname?: string | null): string => {
  return `${userNickname || userName || "사용자"}의 연습`;
};

// title trim 처리를 위한 순수 함수
export const ensureReservationTitle = (
  reservationForm: Required<ReservationForm>,
  userName?: string | null,
  userNickname?: string | null
): Required<ReservationForm> => {
  const reservationFormCopy = { ...reservationForm };
  
  if (!reservationFormCopy.title.trim()) {
    reservationFormCopy.title = createDefaultTitle(userName, userNickname);
  }
  
  return reservationFormCopy;
};
