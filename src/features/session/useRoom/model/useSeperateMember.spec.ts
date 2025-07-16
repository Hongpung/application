import { renderHook } from "@testing-library/react-native";
import { Member } from "@hongpung/src/entities/member";
import { Session } from "@hongpung/src/entities/session";
import { useSeperateMember } from "./useSeperateMember";

// Mock dependencies
jest.mock("@hongpung/src/entities/member");
jest.mock("@hongpung/src/entities/session");

describe("useSeperateMember", () => {
  // 테스트용 멤버 데이터
  const mockMember1: Member = { id: 1, name: "김철수", nickname: "철수" } as unknown as Member;
  const mockMember2: Member = { id: 2, name: "이영희", nickname: "영희" } as unknown as Member;
  const mockMember3: Member = { id: 3, name: "박민수", nickname: "민수" } as unknown as Member;
  const mockMember4: Member = { id: 4, name: "최지영", nickname: "지영" } as unknown as Member;
  const mockMember5: Member = { id: 5, name: "정대현", nickname: "대현" } as unknown as Member;

  beforeEach(() => {
    jest.clearAllMocks();
    // console.log 모킹
    console.log = jest.fn();
  });

  describe("초기 상태", () => {
    it("session이 null일 때 모든 배열이 빈 배열로 초기화된다", () => {
      const { result } = renderHook(() => useSeperateMember(null));

      expect(result.current.attendUsers).toEqual([]);
      expect(result.current.lateUsers).toEqual([]);
      expect(result.current.absentUsers).toEqual([]);
    });

    it("session이 undefined일 때 모든 배열이 빈 배열로 초기화된다", () => {
      const { result } = renderHook(() => useSeperateMember(undefined as any));

      expect(result.current.attendUsers).toEqual([]);
      expect(result.current.lateUsers).toEqual([]);
      expect(result.current.absentUsers).toEqual([]);
    });

    it("attendanceList가 없는 session일 때 모든 배열이 빈 배열로 초기화된다", () => {
      const mockSession: Session = {
        id: 1,
        attendanceList: [],
      } as unknown as Session;

      const { result } = renderHook(() => useSeperateMember(mockSession));

      expect(result.current.attendUsers).toEqual([]);
      expect(result.current.lateUsers).toEqual([]);
      expect(result.current.absentUsers).toEqual([]);
    });
  });

  describe("참석 상태별 멤버 분류", () => {
    it("참가 상태의 멤버들을 attendUsers에 분류한다", () => {
      const mockSession: Session = {
        id: 1,
        attendanceList: [
          { user: mockMember1, status: "참가" },
          { user: mockMember2, status: "참가" },
        ],
      } as unknown as Session;

      const { result } = renderHook(() => useSeperateMember(mockSession));

      expect(result.current.attendUsers).toEqual([mockMember1, mockMember2]);
      expect(result.current.lateUsers).toEqual([]);
      expect(result.current.absentUsers).toEqual([]);
    });

    it("출석 상태의 멤버들을 attendUsers에 분류한다", () => {
      const mockSession: Session = {
        id: 1,
        attendanceList: [
          { user: mockMember1, status: "출석" },
          { user: mockMember2, status: "출석" },
        ],
      } as Session;

      const { result } = renderHook(() => useSeperateMember(mockSession));

      expect(result.current.attendUsers).toEqual([mockMember1, mockMember2]);
      expect(result.current.lateUsers).toEqual([]);
      expect(result.current.absentUsers).toEqual([]);
    });

    it("지각 상태의 멤버들을 lateUsers에 분류한다", () => {
      const mockSession: Session = {
        id: 1,
        attendanceList: [
          { user: mockMember1, status: "지각" },
          { user: mockMember2, status: "지각" },
        ],
      } as Session;

      const { result } = renderHook(() => useSeperateMember(mockSession));

      expect(result.current.attendUsers).toEqual([]);
      expect(result.current.lateUsers).toEqual([mockMember1, mockMember2]);
      expect(result.current.absentUsers).toEqual([]);
    });

    it("결석 상태의 멤버들을 absentUsers에 분류한다", () => {
      const mockSession: Session = {
        id: 1,
        attendanceList: [
          { user: mockMember1, status: "결석" },
          { user: mockMember2, status: "결석" },
        ],
      } as Session;

      const { result } = renderHook(() => useSeperateMember(mockSession));

      expect(result.current.attendUsers).toEqual([]);
      expect(result.current.lateUsers).toEqual([]);
      expect(result.current.absentUsers).toEqual([mockMember1, mockMember2]);
    });

    it("참가와 출석 상태의 멤버들을 함께 attendUsers에 분류한다", () => {
      const mockSession: Session = {
        id: 1,
        attendanceList: [
          { user: mockMember1, status: "참가" },
          { user: mockMember2, status: "출석" },
          { user: mockMember3, status: "참가" },
        ],
      } as Session;

      const { result } = renderHook(() => useSeperateMember(mockSession));

      expect(result.current.attendUsers).toEqual([mockMember1, mockMember2, mockMember3]);
      expect(result.current.lateUsers).toEqual([]);
      expect(result.current.absentUsers).toEqual([]);
    });
  });

  describe("복합 상태 멤버 분류", () => {
    it("모든 상태의 멤버들을 올바르게 분류한다", () => {
      const mockSession: Session = {
        id: 1,
        attendanceList: [
          { user: mockMember1, status: "참가" },
          { user: mockMember2, status: "출석" },
          { user: mockMember3, status: "지각" },
          { user: mockMember4, status: "결석" },
          { user: mockMember5, status: "참가" },
        ],
      } as Session;

      const { result } = renderHook(() => useSeperateMember(mockSession));

      expect(result.current.attendUsers).toEqual([mockMember1, mockMember2, mockMember5]);
      expect(result.current.lateUsers).toEqual([mockMember3]);
      expect(result.current.absentUsers).toEqual([mockMember4]);
    });

    it("같은 상태의 여러 멤버들을 순서대로 분류한다", () => {
      const mockSession: Session = {
        id: 1,
        attendanceList: [
          { user: mockMember1, status: "지각" },
          { user: mockMember2, status: "결석" },
          { user: mockMember3, status: "지각" },
          { user: mockMember4, status: "결석" },
          { user: mockMember5, status: "지각" },
        ],
      } as Session;

      const { result } = renderHook(() => useSeperateMember(mockSession));

      expect(result.current.attendUsers).toEqual([]);
      expect(result.current.lateUsers).toEqual([mockMember1, mockMember3, mockMember5]);
      expect(result.current.absentUsers).toEqual([mockMember2, mockMember4]);
    });
  });

  describe("session 데이터 변경 처리", () => {
    it("session의 attendanceList가 변경되면 새로운 분류 결과를 반영한다", () => {
      const initialSession: Session = {
        id: 1,
        attendanceList: [
          { user: mockMember1, status: "참가" },
          { user: mockMember2, status: "지각" },
        ],
      } as Session;

      const updatedSession: Session = {
        id: 1,
        attendanceList: [
          { user: mockMember1, status: "결석" },
          { user: mockMember2, status: "출석" },
          { user: mockMember3, status: "지각" },
        ],
      } as Session;

      const { result, rerender } = renderHook(
        ({ session }) => useSeperateMember(session),
        { initialProps: { session: initialSession } }
      );

      // 초기 상태 확인
      expect(result.current.attendUsers).toEqual([mockMember1]);
      expect(result.current.lateUsers).toEqual([mockMember2]);
      expect(result.current.absentUsers).toEqual([]);

      // session 변경
      rerender({ session: updatedSession });

      // 변경된 상태 확인
      expect(result.current.attendUsers).toEqual([mockMember2]);
      expect(result.current.lateUsers).toEqual([mockMember3]);
      expect(result.current.absentUsers).toEqual([mockMember1]);
    });

    it("session이 null로 변경되면 모든 배열이 빈 배열이 된다", () => {
      const initialSession: Session = {
        id: 1,
        attendanceList: [
          { user: mockMember1, status: "참가" },
          { user: mockMember2, status: "지각" },
        ],
      } as Session;

      const { result, rerender } = renderHook(
        ({ session }) => useSeperateMember(session),
        { initialProps: { session: initialSession } }
      );

      // 초기 상태 확인
      expect(result.current.attendUsers).toEqual([mockMember1]);
      expect(result.current.lateUsers).toEqual([mockMember2]);

      // session을 null로 변경
      rerender({ session: null });

      // 모든 배열이 빈 배열이 되어야 함
      expect(result.current.attendUsers).toEqual([]);
      expect(result.current.lateUsers).toEqual([]);
      expect(result.current.absentUsers).toEqual([]);
    });
  });

  describe("빈 attendanceList 처리", () => {
    it("빈 attendanceList를 가진 session이 주어지면 모든 배열이 빈 배열이 된다", () => {
      const mockSession: Session = {
        id: 1,
        attendanceList: [],
      } as Session;

      const { result } = renderHook(() => useSeperateMember(mockSession));

      expect(result.current.attendUsers).toEqual([]);
      expect(result.current.lateUsers).toEqual([]);
      expect(result.current.absentUsers).toEqual([]);
    });
  });

  describe("콘솔 로깅", () => {
    it("각 상태별 사용자 목록을 콘솔에 로그한다", () => {
      const mockSession: Session = {
        id: 1,
        attendanceList: [
          { user: mockMember1, status: "참가" },
          { user: mockMember2, status: "지각" },
          { user: mockMember3, status: "결석" },
        ],
      } as Session;

      renderHook(() => useSeperateMember(mockSession));

      expect(console.log).toHaveBeenCalledWith("attendUsers", [mockMember1]);
      expect(console.log).toHaveBeenCalledWith("lateUsers", [mockMember2]);
      expect(console.log).toHaveBeenCalledWith("absentUsers", [mockMember3]);
    });
  });

  describe("반환값 검증", () => {
    it("올바른 형태의 객체를 반환한다", () => {
      const { result } = renderHook(() => useSeperateMember(null));

      expect(result.current).toHaveProperty("attendUsers");
      expect(result.current).toHaveProperty("lateUsers");
      expect(result.current).toHaveProperty("absentUsers");
      expect(Array.isArray(result.current.attendUsers)).toBe(true);
      expect(Array.isArray(result.current.lateUsers)).toBe(true);
      expect(Array.isArray(result.current.absentUsers)).toBe(true);
    });
  });
}); 