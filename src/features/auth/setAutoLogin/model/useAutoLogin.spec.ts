import { renderHook, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAutoLogin from "./useAutoLogin";
import {
  turnOnAutoLoginSuccessToast,
  turnOnAutoLoginFailedToast,
  turnOffAutoLoginSuccessToast,
  turnOffAutoLoginFailedToast,
} from "../lib/toast";

// Mock dependencies
jest.mock("@react-native-async-storage/async-storage");
jest.mock("../lib/toast");

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockTurnOnAutoLoginSuccessToast = turnOnAutoLoginSuccessToast as jest.MockedFunction<
  typeof turnOnAutoLoginSuccessToast
>;
const mockTurnOnAutoLoginFailedToast = turnOnAutoLoginFailedToast as jest.MockedFunction<
  typeof turnOnAutoLoginFailedToast
>;
const mockTurnOffAutoLoginSuccessToast = turnOffAutoLoginSuccessToast as jest.MockedFunction<
  typeof turnOffAutoLoginSuccessToast
>;
const mockTurnOffAutoLoginFailedToast = turnOffAutoLoginFailedToast as jest.MockedFunction<
  typeof turnOffAutoLoginFailedToast
>;

describe("useAutoLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // console.error 모킹
  });

  describe("초기 상태", () => {
    it("자동 로그인이 설정되어 있지 않으면 false로 초기화된다", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const { result } = renderHook(() => useAutoLogin());

      await waitFor(() => {
        expect(result.current[0]).toBe(false);
      });

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith("autoLogin");
    });

    it("자동 로그인이 설정되어 있으면 true로 초기화된다", async () => {
      mockAsyncStorage.getItem.mockResolvedValue("true");

      const { result } = renderHook(() => useAutoLogin());

      await waitFor(() => {
        expect(result.current[0]).toBe(true);
      });

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith("autoLogin");
    });

    it("AsyncStorage에서 에러가 발생하면 false로 설정된다", async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));

      const { result } = renderHook(() => useAutoLogin());

      await waitFor(() => {
        expect(result.current[0]).toBe(false);
      });
    });
  });

  describe("자동 로그인 토글 기능", () => {
    it("사용자가 자동 로그인을 켜면 상태가 true로 변경된다", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const { result } = renderHook(() => useAutoLogin());

      await waitFor(() => {
        expect(result.current[0]).toBe(false);
      });

      act(() => {
        result.current[1](); // toggleAutoLogin
      });

      expect(result.current[0]).toBe(true);
    });

    it("사용자가 자동 로그인을 끄면 상태가 false로 변경된다", async () => {
      mockAsyncStorage.getItem.mockResolvedValue("true");

      const { result } = renderHook(() => useAutoLogin());

      await waitFor(() => {
        expect(result.current[0]).toBe(true);
      });

      act(() => {
        result.current[1](); // toggleAutoLogin
      });

      expect(result.current[0]).toBe(false);
    });
  });

  describe("컴포넌트 언마운트 시 자동 로그인 처리", () => {
    it("자동 로그인을 켠 상태에서 언마운트하면 AsyncStorage에 저장하고 성공 토스트를 보여준다", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue();

      const { result, unmount } = renderHook(() => useAutoLogin());

      await waitFor(() => {
        expect(result.current[0]).toBe(false);
      });

      // 자동 로그인 켜기
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(true);

      // 컴포넌트 언마운트
      unmount();

      await waitFor(() => {
        expect(mockAsyncStorage.setItem).toHaveBeenCalledWith("autoLogin", "true");
        expect(mockTurnOnAutoLoginSuccessToast).toHaveBeenCalled();
      });
    });

    it("자동 로그인을 끈 상태에서 언마운트하면 AsyncStorage에서 제거하고 성공 토스트를 보여준다", async () => {
      mockAsyncStorage.getItem.mockResolvedValue("true");
      mockAsyncStorage.removeItem.mockResolvedValue();

      const { result, unmount } = renderHook(() => useAutoLogin());

      await waitFor(() => {
        expect(result.current[0]).toBe(true);
      });

      // 자동 로그인 끄기
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(false);

      // 컴포넌트 언마운트
      unmount();

      await waitFor(() => {
        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith("autoLogin");
        expect(mockTurnOffAutoLoginSuccessToast).toHaveBeenCalled();
      });
    });

    it("자동 로그인 저장 중 에러가 발생하면 상태를 false로 되돌리고 실패 토스트를 보여준다", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockRejectedValue(new Error("Storage error"));

      const { result, unmount } = renderHook(() => useAutoLogin());

      await waitFor(() => {
        expect(result.current[0]).toBe(false);
      });

      // 자동 로그인 켜기
      act(() => {
        result.current[1]();
      });

      // 컴포넌트 언마운트
      unmount();

      await waitFor(() => {
        expect(mockTurnOnAutoLoginFailedToast).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
      });
    });

    it("자동 로그인 제거 중 에러가 발생하면 상태를 true로 되돌리고 실패 토스트를 보여준다", async () => {
      mockAsyncStorage.getItem.mockResolvedValue("true");
      mockAsyncStorage.removeItem.mockRejectedValue(new Error("Storage error"));

      const { result, unmount } = renderHook(() => useAutoLogin());

      await waitFor(() => {
        expect(result.current[0]).toBe(true);
      });

      // 자동 로그인 끄기
      act(() => {
        result.current[1]();
      });

      // 컴포넌트 언마운트
      unmount();

      await waitFor(() => {
        expect(mockTurnOffAutoLoginFailedToast).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
      });
    });

    it("변경 사항이 없으면 언마운트 시 AsyncStorage 작업을 수행하지 않는다", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const { unmount } = renderHook(() => useAutoLogin());

      await waitFor(() => {
        expect(mockAsyncStorage.getItem).toHaveBeenCalled();
      });

      // 토글 없이 바로 언마운트
      unmount();

      // AsyncStorage 설정/제거 작업이 호출되지 않음
      expect(mockAsyncStorage.setItem).not.toHaveBeenCalled();
      expect(mockAsyncStorage.removeItem).not.toHaveBeenCalled();
      expect(mockTurnOnAutoLoginSuccessToast).not.toHaveBeenCalled();
      expect(mockTurnOffAutoLoginSuccessToast).not.toHaveBeenCalled();
    });
  });

  describe("반환값 타입", () => {
    it("올바른 타입의 tuple을 반환한다", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const { result } = renderHook(() => useAutoLogin());

      await waitFor(() => {
        expect(typeof result.current[0]).toBe("boolean");
        expect(typeof result.current[1]).toBe("function");
        expect(result.current).toHaveLength(2);
      });
    });
  });
});
