import { renderHook, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFirstPage } from "./useFirstPage";

describe("useFirstPage 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("첫 번째 실행 시", () => {
    it("isLaunched가 null이라면 튜토리얼 화면 반환", async () => {
      jest.spyOn(AsyncStorage, "getItem").mockImplementation((key: string) => {
        if (key === "isLaunched") return Promise.resolve(null);
        if (key === "autoLogin") return Promise.resolve(null);
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useFirstPage());
      await waitFor(() => {
        expect(result.current.firstScreen).toBe("Tutorial");
      });
    });
  });

  describe("첫 번째 실행이 아니라면", () => {
    it("autoLogin이 꺼져있다면 로그인 화면 반환", async () => {
      jest.spyOn(AsyncStorage, "getItem").mockImplementation((key: string) => {
        if (key === "isLaunched") return Promise.resolve("true");
        if (key === "autoLogin") return Promise.resolve(null);
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useFirstPage());
      await waitFor(() => {
        expect(result.current.firstScreen).toBe("LoginStack");
      });
    });

    it("autoLogin이 켜져있다면 메인 화면으로 이동", async () => {
      jest.spyOn(AsyncStorage, "getItem").mockImplementation((key: string) => {
        if (key === "isLaunched") return Promise.resolve("true");
        if (key === "autoLogin") return Promise.resolve("true");
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useFirstPage());
      await waitFor(() => {
        expect(result.current.firstScreen).toBe("Main");
      });
    });
  });
});
