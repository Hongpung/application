import { renderHook, act } from "@testing-library/react-native";
import useReservationForm from "./useReservationForm";
import type { ReservationForm } from "@hongpung/src/entities/reservation";
import type { Member } from "@hongpung/src/entities/member/@x/reservation";
import type { Instrument } from "@hongpung/src/entities/instrument/@x/reservation";

// 테스트용 Mock 데이터
const mockMember: Member = {
  memberId: 1,
  name: "홍길동",
  nickname: "홍길동",
  club: "들녘",
  email: "hong@example.com",
  enrollmentNumber: "20241234",
  role: ["USER"],
};

const mockInstrument: Instrument = {
  instrumentId: 1,
  name: "꽹과리",
  instrumentType: "꽹과리",
  club: "들녘",
  borrowAvailable: true,
};

describe("useReservationForm 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("초기 상태 테스트", () => {
    it("기본값으로 예약 폼이 초기화된다", () => {
      const { result } = renderHook(() => useReservationForm());

      expect(result.current.reservationForm).toEqual({
        title: "",
        reservationType: "REGULAR",
        participationAvailable: false,
        borrowInstruments: [],
        participators: [],
      });
    });

    it("초기값이 제공되면 해당 값으로 초기화된다", () => {
      const initialForm: ReservationForm = {
        title: "초기 예약",
        date: "2024-01-15",
        startTime: "14:00",
        endTime: "16:00",
        reservationType: "COMMON",
        participationAvailable: true,
        borrowInstruments: [mockInstrument],
        participators: [mockMember],
      };

      const { result } = renderHook(() => useReservationForm(initialForm));

      expect(result.current.reservationForm).toEqual(initialForm);
    });

    it("초기 상태에서는 폼이 완성되지 않은 상태이다", () => {
      const { result } = renderHook(() => useReservationForm());

      const isComplete = result.current.isCompleteReservation(
        result.current.reservationForm
      );

      expect(isComplete).toBe(false);
    });
  });

  describe("필드 설정 테스트", () => {
    it("제목을 설정할 수 있다", () => {
      const { result } = renderHook(() => useReservationForm());

      act(() => {
        result.current.setForm.setTitle("새로운 예약");
      });

      expect(result.current.reservationForm.title).toBe("새로운 예약");
    });

    it("예약 유형을 설정할 수 있다", () => {
      const { result } = renderHook(() => useReservationForm());

      act(() => {
        result.current.setForm.setReservationType("COMMON");
      });

      expect(result.current.reservationForm.reservationType).toBe("COMMON");
    });

    it("참가 가능 여부를 설정할 수 있다", () => {
      const { result } = renderHook(() => useReservationForm());

      act(() => {
        result.current.setForm.setParticipationAvailable(true);
      });

      expect(result.current.reservationForm.participationAvailable).toBe(true);
    });

    it("참가자 목록을 설정할 수 있다", () => {
      const { result } = renderHook(() => useReservationForm());

      const participants = [mockMember];

      act(() => {
        result.current.setForm.setParticipators(participants);
      });

      expect(result.current.reservationForm.participators).toEqual(participants);
    });

    it("대여 악기 목록을 설정할 수 있다", () => {
      const { result } = renderHook(() => useReservationForm());

      const instruments = [mockInstrument];

      act(() => {
        result.current.setForm.setBorrowInstruments(instruments);
      });

      expect(result.current.reservationForm.borrowInstruments).toEqual(instruments);
    });
  });

  describe("날짜 및 시간 설정 테스트", () => {
    it("날짜를 설정하면 시간 정보가 초기화된다", () => {
      const { result } = renderHook(() => {
        const initialForm: ReservationForm = {
          title: "테스트",
          date: "2024-01-15",
          startTime: "14:00",
          endTime: "16:00",
          reservationType: "REGULAR",
          participationAvailable: false,
          borrowInstruments: [],
          participators: [],
        };
        return useReservationForm(initialForm);
      });

      // 날짜를 변경
      act(() => {
        result.current.setForm.setDate("2024-01-16");
      });

      expect(result.current.reservationForm.date).toBe("2024-01-16");
      expect(result.current.reservationForm.startTime).toBeUndefined();
      expect(result.current.reservationForm.endTime).toBeUndefined();
    });

    it("시작 시간을 설정하면 종료 시간이 초기화된다", () => {
      const { result } = renderHook(() => {
        const initialForm: ReservationForm = {
          title: "테스트",
          date: "2024-01-15",
          startTime: "14:00",
          endTime: "16:00",
          reservationType: "REGULAR",
          participationAvailable: false,
          borrowInstruments: [],
          participators: [],
        };
        return useReservationForm(initialForm);
      });

      // 시작 시간을 변경
      act(() => {
        result.current.setForm.setStartTime("15:00");
      });

      expect(result.current.reservationForm.startTime).toBe("15:00");
      expect(result.current.reservationForm.endTime).toBeUndefined();
    });

    it("종료 시간만 설정하는 경우 정상적으로 설정된다", () => {
      const { result } = renderHook(() => useReservationForm());

      act(() => {
        result.current.setForm.setEndTime("18:00");
      });

      expect(result.current.reservationForm.endTime).toBe("18:00");
    });
  });

  describe("폼 완성도 검사 테스트", () => {
    it("모든 필수 필드가 채워지면 완성된 폼으로 인식된다", () => {
      const { result } = renderHook(() => useReservationForm());

      act(() => {
        result.current.setForm.setTitle("완성된 예약");
        result.current.setForm.setDate("2024-01-15");
        result.current.setForm.setStartTime("14:00");
        result.current.setForm.setEndTime("16:00");
        result.current.setForm.setReservationType("REGULAR");
        result.current.setForm.setParticipationAvailable(false);
        result.current.setForm.setParticipators([]);
        result.current.setForm.setBorrowInstruments([]);
      });

      const isComplete = result.current.isCompleteReservation(
        result.current.reservationForm
      );

      expect(isComplete).toBe(true);
    });

    it("제목이 null이면 완성되지 않은 폼으로 인식된다", () => {
      const { result } = renderHook(() => useReservationForm());

      act(() => {
        result.current.setForm.setTitle(null as any); // null로 설정
        result.current.setForm.setDate("2024-01-15");
        result.current.setForm.setStartTime("14:00");
        result.current.setForm.setEndTime("16:00");
      });

      const isComplete = result.current.isCompleteReservation(
        result.current.reservationForm
      );

      expect(isComplete).toBe(false);
    });

    it("날짜가 없으면 완성되지 않은 폼으로 인식된다", () => {
      const { result } = renderHook(() => useReservationForm());

      act(() => {
        result.current.setForm.setTitle("제목");
        // date는 설정하지 않음
        result.current.setForm.setStartTime("14:00");
        result.current.setForm.setEndTime("16:00");
      });

      const isComplete = result.current.isCompleteReservation(
        result.current.reservationForm
      );

      expect(isComplete).toBe(false);
    });

    it("시작 시간이 없으면 완성되지 않은 폼으로 인식된다", () => {
      const { result } = renderHook(() => useReservationForm());

      act(() => {
        result.current.setForm.setTitle("제목");
        result.current.setForm.setDate("2024-01-15");
        // startTime은 설정하지 않음
        result.current.setForm.setEndTime("16:00");
      });

      const isComplete = result.current.isCompleteReservation(
        result.current.reservationForm
      );

      expect(isComplete).toBe(false);
    });

    it("종료 시간이 없으면 완성되지 않은 폼으로 인식된다", () => {
      const { result } = renderHook(() => useReservationForm());

      act(() => {
        result.current.setForm.setTitle("제목");
        result.current.setForm.setDate("2024-01-15");
        result.current.setForm.setStartTime("14:00");
        // endTime은 설정하지 않음
      });

      const isComplete = result.current.isCompleteReservation(
        result.current.reservationForm
      );

      expect(isComplete).toBe(false);
    });
  });

  describe("복합 시나리오 테스트", () => {
    it("사용자가 예약 폼을 단계적으로 작성하는 시나리오", () => {
      const { result } = renderHook(() => useReservationForm());

      // 1단계: 제목 입력
      act(() => {
        result.current.setForm.setTitle("팀 연습");
      });

      expect(result.current.reservationForm.title).toBe("팀 연습");
      expect(
        result.current.isCompleteReservation(result.current.reservationForm)
      ).toBe(false);

      // 2단계: 날짜 선택
      act(() => {
        result.current.setForm.setDate("2024-01-20");
      });

      expect(result.current.reservationForm.date).toBe("2024-01-20");
      expect(
        result.current.isCompleteReservation(result.current.reservationForm)
      ).toBe(false);

      // 3단계: 시간 선택
      act(() => {
        result.current.setForm.setStartTime("15:00");
      });

      expect(result.current.reservationForm.startTime).toBe("15:00");
      expect(
        result.current.isCompleteReservation(result.current.reservationForm)
      ).toBe(false);

      act(() => {
        result.current.setForm.setEndTime("17:00");
      });

      expect(result.current.reservationForm.endTime).toBe("17:00");
      expect(
        result.current.isCompleteReservation(result.current.reservationForm)
      ).toBe(true);

      // 4단계: 참가자 추가
      act(() => {
        result.current.setForm.setParticipators([mockMember]);
      });

      expect(result.current.reservationForm.participators).toEqual([mockMember]);
      expect(
        result.current.isCompleteReservation(result.current.reservationForm)
      ).toBe(true);

      // 5단계: 악기 대여 추가
      act(() => {
        result.current.setForm.setBorrowInstruments([mockInstrument]);
      });

      expect(result.current.reservationForm.borrowInstruments).toEqual([
        mockInstrument,
      ]);
      expect(
        result.current.isCompleteReservation(result.current.reservationForm)
      ).toBe(true);
    });

    it("사용자가 날짜를 변경하면 시간 정보가 초기화되어 폼이 미완성 상태가 된다", () => {
      const { result } = renderHook(() => useReservationForm());

      // 완성된 폼 만들기
      act(() => {
        result.current.setForm.setTitle("연습");
        result.current.setForm.setDate("2024-01-15");
        result.current.setForm.setStartTime("14:00");
        result.current.setForm.setEndTime("16:00");
      });

      expect(
        result.current.isCompleteReservation(result.current.reservationForm)
      ).toBe(true);

      // 날짜 변경
      act(() => {
        result.current.setForm.setDate("2024-01-16");
      });

      // 시간 정보가 초기화되어 미완성 상태
      expect(result.current.reservationForm.startTime).toBeUndefined();
      expect(result.current.reservationForm.endTime).toBeUndefined();
      expect(
        result.current.isCompleteReservation(result.current.reservationForm)
      ).toBe(false);
    });

    it("사용자가 시작 시간을 변경하면 종료 시간이 초기화되어 폼이 미완성 상태가 된다", () => {
      const { result } = renderHook(() => useReservationForm());

      // 완성된 폼 만들기
      act(() => {
        result.current.setForm.setTitle("연습");
        result.current.setForm.setDate("2024-01-15");
        result.current.setForm.setStartTime("14:00");
        result.current.setForm.setEndTime("16:00");
      });

      expect(
        result.current.isCompleteReservation(result.current.reservationForm)
      ).toBe(true);

      // 시작 시간 변경
      act(() => {
        result.current.setForm.setStartTime("15:00");
      });

      // 종료 시간이 초기화되어 미완성 상태
      expect(result.current.reservationForm.startTime).toBe("15:00");
      expect(result.current.reservationForm.endTime).toBeUndefined();
      expect(
        result.current.isCompleteReservation(result.current.reservationForm)
      ).toBe(false);
    });

    it("예약 유형을 변경해도 다른 필드에는 영향을 주지 않는다", () => {
      const { result } = renderHook(() => useReservationForm());

      // 완성된 폼 만들기
      act(() => {
        result.current.setForm.setTitle("연습");
        result.current.setForm.setDate("2024-01-15");
        result.current.setForm.setStartTime("14:00");
        result.current.setForm.setEndTime("16:00");
        result.current.setForm.setReservationType("REGULAR");
      });

      const originalForm = { ...result.current.reservationForm };

      // 예약 유형 변경
      act(() => {
        result.current.setForm.setReservationType("COMMON");
      });

      expect(result.current.reservationForm.reservationType).toBe("COMMON");
      expect(result.current.reservationForm.title).toBe(originalForm.title);
      expect(result.current.reservationForm.date).toBe(originalForm.date);
      expect(result.current.reservationForm.startTime).toBe(originalForm.startTime);
      expect(result.current.reservationForm.endTime).toBe(originalForm.endTime);
      expect(
        result.current.isCompleteReservation(result.current.reservationForm)
      ).toBe(true);
    });
  });
}); 