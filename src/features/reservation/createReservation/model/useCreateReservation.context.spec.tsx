import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import {
  CreateReservationContextProvider,
  useCreateReservation,
} from "./useCreateReservation.context";
import { ReservationForm } from "@hongpung/src/entities/reservation";
import type { Instrument } from "@hongpung/src/entities/instrument/@x/reservation";
import type { Member } from "@hongpung/src/entities/member/@x/reservation";

// Navigation 모킹
const mockDispatch = jest.fn();
const mockNavigation = {
  dispatch: mockDispatch,
  navigate: jest.fn(),
  goBack: jest.fn(),
};

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => mockNavigation,
  CommonActions: {
    reset: jest.fn((config) => ({ type: "RESET", ...config })),
  },
}));

// Alert 모킹
const mockAlert = {
  alert: jest.fn(),
};

jest.mock("@hongpung/src/common", () => ({
  ...jest.requireActual("@hongpung/src/common"),
  Alert: mockAlert,
}));

// API 모킹
const mockCreateReservationRequest = jest.fn();
jest.mock("@hongpung/src/entities/reservation", () => ({
  ...jest.requireActual("@hongpung/src/entities/reservation"),
  useCreateReservationRequest: () => ({
    request: mockCreateReservationRequest,
    isLoading: false,
    error: null,
  }),
  parseReservationCreateRequestBody: jest.fn((form) => form),
}));

// useReservationForm 모킹
const mockSetForm = {
  setDate: jest.fn(),
  setStartTime: jest.fn(),
  setEndTime: jest.fn(),
  setTitle: jest.fn(),
  setParticipationAvailable: jest.fn(),
  setReservationType: jest.fn(),
  setParticipators: jest.fn(),
  setBorrowInstruments: jest.fn(),
};

const mockReservationForm: ReservationForm = {
  date: "2024-01-15",
  startTime: "10:00",
  endTime: "10:30",
  title: "",
  participationAvailable: true,
  reservationType: "COMMON",
  participators: [],
  borrowInstruments: [],
};

const mockIsCompleteReservation = jest.fn();

jest.mock("../../configureReservation/model/useReservationForm", () => ({
  __esModule: true,
  default: () => ({
    reservationForm: mockReservationForm,
    isCompleteReservation: mockIsCompleteReservation,
    setForm: mockSetForm,
  }),
}));

// Jotai 모킹
const mockUserData = {
  memberId: 1,
  name: "홍길동",
  nickname: "길동이",
  email: "hong@example.com",
  role: ["USER"],
};

jest.mock("jotai", () => ({
  useAtomValue: () => mockUserData,
}));

// Toast 모킹
jest.mock("../lib/toast", () => ({
  createCompleteToast: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CreateReservationContextProvider>{children}</CreateReservationContextProvider>
);

describe("useCreateReservation Context 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsCompleteReservation.mockReturnValue(false);
    mockCreateReservationRequest.mockResolvedValue({ reservationId: 123 });
  });

  describe("초기 상태 테스트", () => {
    it("초기 상태가 올바르게 설정된다", () => {
      const { result } = renderHook(() => useCreateReservation(), { wrapper });

      expect(result.current.reservation).toEqual(mockReservationForm);
      expect(result.current.isValidReservation).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(typeof result.current.requestCreateReservation).toBe("function");
    });

    it("모든 setForm 함수들이 제공된다", () => {
      const { result } = renderHook(() => useCreateReservation(), { wrapper });

      expect(result.current.setDate).toBeDefined();
      expect(result.current.setStartTime).toBeDefined();
      expect(result.current.setEndTime).toBeDefined();
      expect(result.current.setTitle).toBeDefined();
      expect(result.current.setParticipationAvailable).toBeDefined();
      expect(result.current.setReservationType).toBeDefined();
      expect(result.current.setParticipators).toBeDefined();
      expect(result.current.setBorrowInstruments).toBeDefined();
    });
  });

  describe("폼 데이터 설정 테스트", () => {
    it("날짜 설정이 정상 동작한다", () => {
      const { result } = renderHook(() => useCreateReservation(), { wrapper });
      const testDate = "2024-01-15";

      act(() => {
        result.current.setDate(testDate);
      });

      expect(mockSetForm.setDate).toHaveBeenCalledWith(testDate);
    });

    it("시간 설정이 정상 동작한다", () => {
      const { result } = renderHook(() => useCreateReservation(), { wrapper });
      const testStartTime = "14:00";
      const testEndTime = "16:00";

      act(() => {
        result.current.setStartTime(testStartTime);
        result.current.setEndTime(testEndTime);
      });

      expect(mockSetForm.setStartTime).toHaveBeenCalledWith(testStartTime);
      expect(mockSetForm.setEndTime).toHaveBeenCalledWith(testEndTime);
    });

    it("제목 설정이 정상 동작한다", () => {
      const { result } = renderHook(() => useCreateReservation(), { wrapper });
      const testTitle = "피아노 연습";

      act(() => {
        result.current.setTitle(testTitle);
      });

      expect(mockSetForm.setTitle).toHaveBeenCalledWith(testTitle);
    });

    it("참가 가능 여부 설정이 정상 동작한다", () => {
      const { result } = renderHook(() => useCreateReservation(), { wrapper });

      act(() => {
        result.current.setParticipationAvailable(false);
      });

      expect(mockSetForm.setParticipationAvailable).toHaveBeenCalledWith(false);
    });

    it("예약 유형 설정이 정상 동작한다", () => {
      const { result } = renderHook(() => useCreateReservation(), { wrapper });

      act(() => {
        result.current.setReservationType("COMMON");
      });

      expect(mockSetForm.setReservationType).toHaveBeenCalledWith("COMMON");
    });

    it("참가자 설정이 정상 동작한다", () => {
      const { result } = renderHook(() => useCreateReservation(), { wrapper });
      const testParticipators: Member[] = [
        {
          memberId: 1,
          name: "홍길동",
          nickname: "길동이",
          club: "들녘",
          email: "hong@example.com",
          enrollmentNumber: "20241234",
          role: ["USER"],
        },
      ];

      act(() => {
        result.current.setParticipators(testParticipators);
      });

      expect(mockSetForm.setParticipators).toHaveBeenCalledWith(
        testParticipators
      );
    });

    it("대여 악기 설정이 정상 동작한다", () => {
      const { result } = renderHook(() => useCreateReservation(), { wrapper });
      const testInstruments: Instrument[] = [
        {
          instrumentId: 1,
          name: "꽹과리",
          instrumentType: "꽹과리",
          club: "들녘",
          borrowAvailable: true,
        },
      ];

      act(() => {
        result.current.setBorrowInstruments(testInstruments);
      });

      expect(mockSetForm.setBorrowInstruments).toHaveBeenCalledWith(
        testInstruments
      );
    });
  });

  describe("예약 검증 테스트", () => {
    it("완성된 예약일 때 isValidReservation이 true가 된다", () => {
      mockIsCompleteReservation.mockReturnValue(true);

      const { result } = renderHook(() => useCreateReservation(), { wrapper });

      expect(result.current.isValidReservation).toBe(true);
    });

    it("미완성된 예약일 때 isValidReservation이 false가 된다", () => {
      mockIsCompleteReservation.mockReturnValue(false);

      const { result } = renderHook(() => useCreateReservation(), { wrapper });

      expect(result.current.isValidReservation).toBe(false);
    });
  });

  describe("예약 생성 API 요청 테스트", () => {
    it("사용자가 유효한 예약을 생성하면 API 요청이 성공한다", async () => {
      mockIsCompleteReservation.mockReturnValue(true);
      mockReservationForm.title = "테스트 예약";
      mockReservationForm.date = "2024-01-15";
      mockCreateReservationRequest.mockResolvedValue({ reservationId: 123 });

      const { result } = renderHook(() => useCreateReservation(), { wrapper });

      await act(async () => {
        await result.current.requestCreateReservation();
      });

      expect(mockCreateReservationRequest).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "RESET",
          index: 2,
          routes: expect.arrayContaining([
            { name: "ReservationCalendar" },
            {
              name: "DailyReservationList",
              params: { date: "2024-01-15" },
            },
            {
              name: "ReservationDetail",
              params: { reservationId: 123 },
            },
          ]),
        })
      );
    });

    it("사용자가 제목을 입력하지 않으면 자동으로 생성된다", async () => {
      mockIsCompleteReservation.mockReturnValue(true);
      mockReservationForm.title = ""; // 빈 제목
      mockCreateReservationRequest.mockResolvedValue({ reservationId: 123 });

      const { result } = renderHook(() => useCreateReservation(), { wrapper });

      await act(async () => {
        await result.current.requestCreateReservation();
      });

      expect(mockCreateReservationRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "길동이의 연습", // 자동 생성된 제목
        })
      );
    });

    it("사용자 nickname이 없으면 name을 사용한다", async () => {
      const mockUserWithoutNickname = {
        ...mockUserData,
        nickname: undefined,
      };
      
      // 일시적으로 useAtomValue 모킹 변경
      jest.doMock("jotai", () => ({
        useAtomValue: () => mockUserWithoutNickname,
      }));

      mockIsCompleteReservation.mockReturnValue(true);
      mockReservationForm.title = "";
      mockCreateReservationRequest.mockResolvedValue({ reservationId: 123 });

      const { result } = renderHook(() => useCreateReservation(), { wrapper });

      await act(async () => {
        await result.current.requestCreateReservation();
      });

      expect(mockCreateReservationRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "홍길동의 연습", // name 사용
        })
      );
    });

    it("유효하지 않은 예약일 때 에러가 발생한다", async () => {
      mockIsCompleteReservation.mockReturnValue(false);

      const { result } = renderHook(() => useCreateReservation(), { wrapper });

      await act(async () => {
        await result.current.requestCreateReservation();
      });

      expect(mockAlert.alert).toHaveBeenCalledWith(
        "예약 오류",
        "예약을 완벽히 작성해주세요."
      );
      expect(mockCreateReservationRequest).not.toHaveBeenCalled();
    });

    it("API 요청이 실패하면 에러 처리가 동작한다", async () => {
      mockIsCompleteReservation.mockReturnValue(true);
      const errorMessage = "서버 오류가 발생했습니다";
      mockCreateReservationRequest.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCreateReservation(), { wrapper });

      await act(async () => {
        await result.current.requestCreateReservation();
      });

      expect(mockAlert.alert).toHaveBeenCalledWith("예약 오류", errorMessage);
    });

    it("알 수 없는 에러가 발생하면 기본 에러 메시지를 표시한다", async () => {
      mockIsCompleteReservation.mockReturnValue(true);
      mockCreateReservationRequest.mockRejectedValue("Unknown error");

      const { result } = renderHook(() => useCreateReservation(), { wrapper });

      await act(async () => {
        await result.current.requestCreateReservation();
      });

      expect(mockAlert.alert).toHaveBeenCalledWith(
        "예약 오류",
        "예약 생성 중 오류가 발생했어요."
      );
    });
  });

  describe("컨텍스트 사용 에러 테스트", () => {
    it("Provider 외부에서 useCreateReservation 사용 시 에러가 발생한다", () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation();

      expect(() => {
        renderHook(() => useCreateReservation());
      }).toThrow(
        "useCreateReservation must be used within a CreateReservationContextProvider"
      );

      consoleError.mockRestore();
    });
  });

  describe("복합 시나리오 테스트", () => {
    it("사용자가 완전한 예약을 순차적으로 작성하고 생성하는 시나리오", async () => {
      const { result } = renderHook(() => useCreateReservation(), { wrapper });

      // 1. 날짜 설정
      act(() => {
        result.current.setDate("2024-01-15");
      });

      // 2. 시간 설정
      act(() => {
        result.current.setStartTime("14:00");
        result.current.setEndTime("16:00");
      });

      // 3. 제목 설정
      act(() => {
        result.current.setTitle("피아노 연습");
      });

      // 4. 예약 유형 설정
      act(() => {
        result.current.setReservationType("COMMON");
      });

      // 5. 완성된 예약으로 상태 변경
      mockIsCompleteReservation.mockReturnValue(true);
      mockReservationForm.title = "피아노 연습";
      mockReservationForm.date = "2024-01-15";
      mockCreateReservationRequest.mockResolvedValue({ reservationId: 456 });

      // 6. 예약 생성
      await act(async () => {
        await result.current.requestCreateReservation();
      });

      // 모든 설정 함수가 호출되었는지 확인
      expect(mockSetForm.setDate).toHaveBeenCalledWith("2024-01-15");
      expect(mockSetForm.setStartTime).toHaveBeenCalledWith("14:00");
      expect(mockSetForm.setEndTime).toHaveBeenCalledWith("16:00");
      expect(mockSetForm.setTitle).toHaveBeenCalledWith("피아노 연습");
      expect(mockSetForm.setReservationType).toHaveBeenCalledWith("COMMON");

      // API 호출 및 네비게이션 확인
      expect(mockCreateReservationRequest).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
}); 