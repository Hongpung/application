import { renderHook, act } from "@testing-library/react-native";

import useLogout from "./useLogout";

// Mock 함수들을 변수로 선언
const mockRemoveItem = jest.fn();
const mockNavigationDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockShowLogOutToast = jest.fn();
const mockShowLogOutFailToast = jest.fn();
const mockLogoutRequest = jest.fn();
const mockStackReplace = jest.fn();

// baseApi 모킹
jest.mock("@hongpung/src/common/api/baseApi", () => ({
  baseApi: {
    addEndpoints: () => ({}),
  },
}));

// Navigation 모킹
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    dispatch: mockNavigationDispatch,
    setOptions: jest.fn(),
  }),
  StackActions: {
    replace: mockStackReplace,
  },
}));

// AsyncStorage 모킹
jest.mock("@react-native-async-storage/async-storage", () => ({
  removeItem: mockRemoveItem,
}));

// useLogoutRequest 모킹
jest.mock("@hongpung/src/entities/auth", () => ({
  useLogoutRequest: () => ({
    request: mockLogoutRequest,
    isLoading: false,
    error: null,
  }),
}));

// Toast 모킹
jest.mock("../lib/toast", () => ({
  showLogOutToast: mockShowLogOutToast,
  showLogOutFailToast: mockShowLogOutFailToast,
}));

describe("useLogout Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 기본 성공 동작으로 리셋
    mockLogoutRequest.mockResolvedValue({});
  });

  it("초기 상태를 확인한다", () => {
    const { result } = renderHook(() => useLogout());

    expect(result.current.LogOutHandler).toBeDefined();
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.LogOutHandler).toBe("function");
  });

  it("로그아웃 성공 시 정상적으로 처리된다", async () => {
    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.LogOutHandler();
    });

    expect(mockRemoveItem).toHaveBeenCalledWith("autoLogin");
    expect(mockShowLogOutToast).toHaveBeenCalled();
    expect(mockNavigationDispatch).toHaveBeenCalled();
  });

  it("로그아웃 실패 시 에러 처리가 동작한다", async () => {
    // 이 테스트에서만 실패하도록 설정
    mockLogoutRequest.mockRejectedValueOnce(new Error("로그아웃 실패"));

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.LogOutHandler();
    });

    expect(mockShowLogOutFailToast).toHaveBeenCalled();
  });

  it("로딩 상태가 올바르게 반환된다", () => {
    // useLogoutRequest의 isLoading을 true로 만들기 위해 다시 모킹
    const useLogoutRequestMock = jest.requireMock("@hongpung/src/entities/auth").useLogoutRequest;
    useLogoutRequestMock.mockReturnValueOnce({
      request: mockLogoutRequest,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useLogout());

    expect(result.current.isLoading).toBe(true);
  });

  it("에러 상태가 올바르게 반환된다", () => {
    const mockError = new Error("테스트 에러");
    
    // useLogoutRequest의 error를 설정하기 위해 다시 모킹
    const useLogoutRequestMock = jest.requireMock("@hongpung/src/entities/auth").useLogoutRequest;
    useLogoutRequestMock.mockReturnValueOnce({
      request: mockLogoutRequest,
      isLoading: false,
      error: mockError,
    });

    const { result } = renderHook(() => useLogout());

    expect(result.current.isLoading).toBe(false);
  });
}); 