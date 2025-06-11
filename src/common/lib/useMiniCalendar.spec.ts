import { renderHook, act } from "@testing-library/react-native";
import dayjs from "dayjs";
import * as Haptics from "expo-haptics";
import { useMiniCalendar } from "./useMiniCalendar";

// Haptics 모킹
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
}));

describe("useMiniCalendar 테스트", () => {
  const mockHaptics = Haptics.impactAsync as jest.MockedFunction<
    typeof Haptics.impactAsync
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    // 현재 시간을 고정된 값으로 설정 (2024-01-15)
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-15"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("초기 상태 테스트", () => {
    it("선택된 날짜가 null로 초기화된다", () => {
      const { result } = renderHook(() => useMiniCalendar());

      expect(result.current.selectedDate).toBeNull();
    });

    it("현재 월이 오늘 날짜로 초기화된다", () => {
      const { result } = renderHook(() => useMiniCalendar());

      // 2024-01-15로 설정했으므로 1월이어야 함
      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-01"
      );
    });
  });

  describe("날짜 선택 테스트", () => {
    it("날짜를 선택하면 선택된 날짜가 변경된다", () => {
      const { result } = renderHook(() => useMiniCalendar());

      const testDate = new Date("2024-01-20");

      act(() => {
        result.current.handleDateSelect(testDate);
      });

      expect(result.current.selectedDate).toEqual(testDate);
    });

    it("날짜 선택 시 Haptic 피드백이 발생한다", () => {
      const { result } = renderHook(() => useMiniCalendar());

      const testDate = new Date("2024-01-20");

      act(() => {
        result.current.handleDateSelect(testDate);
      });

      expect(mockHaptics).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
    });

    it("null 값으로 날짜 선택을 해제할 수 있다", () => {
      const { result } = renderHook(() => useMiniCalendar());

      // 먼저 날짜를 선택
      const testDate = new Date("2024-01-20");
      act(() => {
        result.current.handleDateSelect(testDate);
      });

      expect(result.current.selectedDate).toEqual(testDate);

      // 날짜 선택 해제
      act(() => {
        result.current.handleDateSelect(null);
      });

      expect(result.current.selectedDate).toBeNull();
    });

    it("다른 날짜를 선택하면 이전 선택이 덮어쓰여진다", () => {
      const { result } = renderHook(() => useMiniCalendar());

      const firstDate = new Date("2024-01-10");
      const secondDate = new Date("2024-01-25");

      // 첫 번째 날짜 선택
      act(() => {
        result.current.handleDateSelect(firstDate);
      });

      expect(result.current.selectedDate).toEqual(firstDate);

      // 두 번째 날짜 선택
      act(() => {
        result.current.handleDateSelect(secondDate);
      });

      expect(result.current.selectedDate).toEqual(secondDate);
    });
  });

  describe("월 변경 테스트", () => {
    it("다음 월로 이동할 수 있다", () => {
      const { result } = renderHook(() => useMiniCalendar());

      // 초기 상태: 2024년 1월
      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-01"
      );

      act(() => {
        result.current.incrementMonth();
      });

      // 2024년 2월로 이동
      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-02"
      );
    });

    it("이전 월로 이동할 수 있다", () => {
      const { result } = renderHook(() => useMiniCalendar());

      // 초기 상태: 2024년 1월
      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-01"
      );

      act(() => {
        result.current.decrementMonth();
      });

      // 2023년 12월로 이동
      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2023-12"
      );
    });

    it("월 변경 시 Medium Haptic 피드백이 발생한다", () => {
      const { result } = renderHook(() => useMiniCalendar());

      act(() => {
        result.current.incrementMonth();
      });

      expect(mockHaptics).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );

      mockHaptics.mockClear();

      act(() => {
        result.current.decrementMonth();
      });

      expect(mockHaptics).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
    });

    it("연속으로 월을 변경할 수 있다", async () => {
      const { result } = renderHook(() => useMiniCalendar());

      // 초기 상태: 2024년 1월
      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-01"
      );

      // 3개월 앞으로 이동
      act(() => {
        result.current.incrementMonth();
        result.current.incrementMonth();
        result.current.incrementMonth();
      });

      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-04"
      );

      // 2개월 뒤로 이동
      act(() => {
        result.current.decrementMonth();
        result.current.decrementMonth();
      });

      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-02"
      );
    });

    it("연도를 넘나드는 월 변경이 정상 동작한다", () => {
      const { result } = renderHook(() => useMiniCalendar());

      // 초기 상태: 2024년 1월
      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-01"
      );

      // 이전 월로 이동 (2023년 12월)
      act(() => {
        result.current.decrementMonth();
      });

      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2023-12"
      );

      // 다시 다음 월로 이동 (2024년 1월)
      act(() => {
        result.current.incrementMonth();
      });

      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-01"
      );
    });
  });

  describe("복합 시나리오 테스트", () => {
    it("사용자가 월을 변경하고 날짜를 선택하는 시나리오", () => {
      const { result } = renderHook(() => useMiniCalendar());

      // 1단계: 다음 월로 이동 (2024년 2월)
      act(() => {
        result.current.incrementMonth();
      });

      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-02"
      );

      // 2단계: 2월의 특정 날짜 선택
      const targetDate = new Date("2024-02-14");
      act(() => {
        result.current.handleDateSelect(targetDate);
      });

      expect(result.current.selectedDate).toEqual(targetDate);
      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-02"
      );
    });

    it("월을 변경해도 선택된 날짜는 유지된다", () => {
      const { result } = renderHook(() => useMiniCalendar());

      // 1월의 날짜 선택
      const selectedDate = new Date("2024-01-15");
      act(() => {
        result.current.handleDateSelect(selectedDate);
      });

      expect(result.current.selectedDate).toEqual(selectedDate);

      // 다음 월로 이동
      act(() => {
        result.current.incrementMonth();
      });

      // 선택된 날짜는 그대로 유지되어야 함
      expect(result.current.selectedDate).toEqual(selectedDate);
      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-02"
      );
    });

    it("여러 번의 월 변경과 날짜 선택이 정상 동작한다", () => {
      const { result } = renderHook(() => useMiniCalendar());

      // 초기 상태 확인
      expect(result.current.selectedDate).toBeNull();
      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-01"
      );

      // 시나리오 1: 다음 월로 이동 후 날짜 선택
      act(() => {
        result.current.incrementMonth();
      });

      const date1 = new Date("2024-02-10");
      act(() => {
        result.current.handleDateSelect(date1);
      });

      expect(result.current.selectedDate).toEqual(date1);

      // 시나리오 2: 다시 다음 월로 이동 후 다른 날짜 선택
      act(() => {
        result.current.incrementMonth();
      });

      const date2 = new Date("2024-03-05");
      act(() => {
        result.current.handleDateSelect(date2);
      });

      expect(result.current.selectedDate).toEqual(date2);
      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-03"
      );

      // 시나리오 3: 이전 월로 이동
      act(() => {
        result.current.decrementMonth();
      });

      expect(result.current.selectedDate).toEqual(date2); // 선택된 날짜는 유지
      expect(dayjs(result.current.currentMonth).format("YYYY-MM")).toBe(
        "2024-02"
      );
    });
  });

  describe("Haptic 피드백 테스트", () => {
    it("날짜 선택과 월 변경에서 서로 다른 강도의 피드백을 제공한다", () => {
      const { result } = renderHook(() => useMiniCalendar());

      // 날짜 선택: Light 피드백
      act(() => {
        result.current.handleDateSelect(new Date("2024-01-15"));
      });

      expect(mockHaptics).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );

      mockHaptics.mockClear();

      // 월 변경: Medium 피드백
      act(() => {
        result.current.incrementMonth();
      });

      expect(mockHaptics).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
    });

    it("연속적인 상호작용에서 매번 피드백이 발생한다", () => {
      const { result } = renderHook(() => useMiniCalendar());

      // 3번의 날짜 선택
      act(() => {
        result.current.handleDateSelect(new Date("2024-01-10"));
        result.current.handleDateSelect(new Date("2024-01-15"));
        result.current.handleDateSelect(new Date("2024-01-20"));
      });

      expect(mockHaptics).toHaveBeenCalledTimes(3);
      expect(mockHaptics).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );

      mockHaptics.mockClear();

      // 2번의 월 변경
      act(() => {
        result.current.incrementMonth();
        result.current.decrementMonth();
      });

      expect(mockHaptics).toHaveBeenCalledTimes(2);
      expect(mockHaptics).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
    });
  });
});
