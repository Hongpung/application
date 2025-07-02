import { renderHook, act } from "@testing-library/react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import { Alert } from "@hongpung/src/common";
import { useDeleteInstrument } from "./useDeleteInstrument";
import { useDeleteInstrumentRequest } from "../api/deleteInstrumentApi";
import { showDeleteInstrumentCompleteToast } from "../constant/toastAction";

// Mock dependencies
jest.mock("@react-navigation/native");
jest.mock("@hongpung/src/common");
jest.mock("../api/deleteInstrumentApi");
jest.mock("../constant/toastAction");

const mockNavigation = {
  dispatch: jest.fn(),
};
const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
const mockAlert = Alert.alert as jest.MockedFunction<typeof Alert.alert>;
const mockUseDeleteInstrumentRequest = useDeleteInstrumentRequest as jest.MockedFunction<
  typeof useDeleteInstrumentRequest
>;
const mockShowDeleteInstrumentCompleteToast = showDeleteInstrumentCompleteToast as jest.MockedFunction<
  typeof showDeleteInstrumentCompleteToast
>;
const mockStackActions = StackActions.replace as jest.MockedFunction<typeof StackActions.replace>;

describe("useDeleteInstrument", () => {
  const mockRequest = jest.fn();
  const mockReplace = {
    type: "REPLACE" as const,
    payload: { name: "InstrumentsHome", params: undefined },
    source: undefined,
    target: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigation.mockReturnValue(mockNavigation);
    mockUseDeleteInstrumentRequest.mockReturnValue({
      request: mockRequest,
      isLoading: false,
    });
    mockStackActions.mockReturnValue(mockReplace as any);
  });

  describe("초기 상태", () => {
    it("초기화 시 올바른 값들을 반환한다", () => {
      const { result } = renderHook(() => useDeleteInstrument());

      expect(result.current.handleDelete).toBeDefined();
      expect(typeof result.current.handleDelete).toBe("function");
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("악기 삭제 성공", () => {
    it("사용자가 악기 삭제를 요청하면 API를 호출하고 성공 토스트를 보여준다", async () => {
      mockRequest.mockResolvedValue({}); // 성공 응답

      const { result } = renderHook(() => useDeleteInstrument());

      await act(async () => {
        await result.current.handleDelete(123);
      });

      expect(mockRequest).toHaveBeenCalledWith({ instrumentId: 123 });
      expect(mockShowDeleteInstrumentCompleteToast).toHaveBeenCalled();
      expect(mockStackActions).toHaveBeenCalledWith("InstrumentsHome");
      expect(mockNavigation.dispatch).toHaveBeenCalledWith(mockReplace);
    });

    it("악기 삭제 성공 후 악기 홈 화면으로 이동한다", async () => {
      mockRequest.mockResolvedValue({});

      const { result } = renderHook(() => useDeleteInstrument());

      await act(async () => {
        await result.current.handleDelete(456);
      });

      expect(mockNavigation.dispatch).toHaveBeenCalledWith(mockReplace);
      expect(mockStackActions).toHaveBeenCalledWith("InstrumentsHome");
    });
  });

  describe("악기 삭제 실패", () => {
    it("API 요청이 Error 인스턴스로 실패하면 에러 메시지와 함께 Alert을 보여준다", async () => {
      const errorMessage = "Network error";
      mockRequest.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useDeleteInstrument());

      await act(async () => {
        await result.current.handleDelete(123);
      });

      expect(mockAlert).toHaveBeenCalledWith("오류", `오류가 발생했어요.\n(${errorMessage})`);
      expect(mockShowDeleteInstrumentCompleteToast).not.toHaveBeenCalled();
      expect(mockNavigation.dispatch).not.toHaveBeenCalled();
    });

    it("API 요청이 알 수 없는 에러로 실패하면 기본 에러 메시지를 보여준다", async () => {
      mockRequest.mockRejectedValue("Unknown error");

      const { result } = renderHook(() => useDeleteInstrument());

      await act(async () => {
        await result.current.handleDelete(123);
      });

      expect(mockAlert).toHaveBeenCalledWith(
        "오류",
        "알수 없는 원인에 의해 실패했어요.\n관리자에게 문의해주세요"
      );
      expect(mockShowDeleteInstrumentCompleteToast).not.toHaveBeenCalled();
      expect(mockNavigation.dispatch).not.toHaveBeenCalled();
    });

    it("서버 에러로 실패하면 서버 에러 메시지를 보여준다", async () => {
      const serverError = new Error("Server internal error");
      mockRequest.mockRejectedValue(serverError);

      const { result } = renderHook(() => useDeleteInstrument());

      await act(async () => {
        await result.current.handleDelete(789);
      });

      expect(mockAlert).toHaveBeenCalledWith("오류", "오류가 발생했어요.\n(Server internal error)");
    });
  });

  describe("로딩 상태", () => {
    it("API 요청 중일 때 isLoading이 true가 된다", () => {
      mockUseDeleteInstrumentRequest.mockReturnValue({
        request: mockRequest,
        isLoading: true,
      });

      const { result } = renderHook(() => useDeleteInstrument());

      expect(result.current.isLoading).toBe(true);
    });

    it("API 요청이 완료되면 isLoading이 false가 된다", () => {
      mockUseDeleteInstrumentRequest.mockReturnValue({
        request: mockRequest,
        isLoading: false,
      });

      const { result } = renderHook(() => useDeleteInstrument());

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("다양한 instrumentId 처리", () => {
    it("양수 instrumentId로 삭제 요청을 처리한다", async () => {
      mockRequest.mockResolvedValue({});

      const { result } = renderHook(() => useDeleteInstrument());

      await act(async () => {
        await result.current.handleDelete(999);
      });

      expect(mockRequest).toHaveBeenCalledWith({ instrumentId: 999 });
    });

    it("1번 instrumentId로 삭제 요청을 처리한다", async () => {
      mockRequest.mockResolvedValue({});

      const { result } = renderHook(() => useDeleteInstrument());

      await act(async () => {
        await result.current.handleDelete(1);
      });

      expect(mockRequest).toHaveBeenCalledWith({ instrumentId: 1 });
    });
  });

  describe("의존성 호출 순서", () => {
    it("성공 시 올바른 순서로 함수들이 호출된다", async () => {
      mockRequest.mockResolvedValue({});
      
      const callOrder: string[] = [];
      
      mockRequest.mockImplementation(async () => {
        callOrder.push("request");
        return {};
      });
      
      mockShowDeleteInstrumentCompleteToast.mockImplementation(() => {
        callOrder.push("toast");
      });
      
      mockNavigation.dispatch.mockImplementation(() => {
        callOrder.push("navigation");
      });

      const { result } = renderHook(() => useDeleteInstrument());

      await act(async () => {
        await result.current.handleDelete(123);
      });

      expect(callOrder).toEqual(["request", "toast", "navigation"]);
    });
  });
}); 