import { renderHook, act } from "@testing-library/react-native";
import { useVerificationCodeFlow } from "./useVerificationCodeFlow";

// Navigation 모킹
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    dispatch: jest.fn(),
  }),
  StackActions: {
    replace: jest.fn(),
  },
}));

// useVerifyResetPasswordVerificationCodeRequest 모킹
jest.mock("@hongpung/src/entities/auth", () => ({
  useVerifyResetPasswordVerificationCodeRequest: () => ({
    request: jest.fn().mockResolvedValue({ token: "mock-token" }),
    isLoading: false,
    error: null,
  }),
}));

// saveToken 모킹
jest.mock("@hongpung/src/common", () => ({
  saveToken: jest.fn(),
  ValidationState: jest.fn(),
}));

// useValidatedForm 모킹
jest.mock("@hongpung/src/common/lib/useValidatedForm", () => ({
  useValidatedForm: () => ({
    verificationCode: "",
    verificationCodeValidation: { state: "BEFORE" },
    setVerificationCode: jest.fn(),
    validateVerificationCode: jest.fn(),
  }),
}));

describe("useVerificationCodeFlow Test", () => {
  const mockEmail = "test@example.com";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("초기 상태를 확인한다", () => {
    const { result } = renderHook(() => useVerificationCodeFlow(mockEmail));

    expect(result.current.verificationCode).toBe("");
    expect(result.current.verificationCodeValidation.state).toBe("BEFORE");
    expect(result.current.isCanVerifyCode).toBe(false);
    expect(result.current.isVerifyingCodeLoading).toBe(false);
    expect(result.current.isVerifyingCodeError).toBe(null);
  });

  it("인증번호 값 설정이 정상 동작한다", () => {
    const mockSetVerificationCode = jest.fn();
    
    jest.doMock("@hongpung/src/common/lib/useValidatedForm", () => ({
      useValidatedForm: () => ({
        verificationCode: "123456",
        verificationCodeValidation: { state: "VALID" },
        setVerificationCode: mockSetVerificationCode,
        validateVerificationCode: jest.fn(),
      }),
    }));

    const { result } = renderHook(() => useVerificationCodeFlow(mockEmail));

    act(() => {
      result.current.setVerificationCode("123456");
    });

    expect(mockSetVerificationCode).toHaveBeenCalledWith("123456");
  });

  it("인증번호 유효성 검사가 정상 동작한다", async () => {
    jest.doMock("@hongpung/src/common/lib/useValidatedForm", () => ({
      useValidatedForm: () => ({
        verificationCode: "12345",
        verificationCodeValidation: { state: "ERROR", errorText: "6자리 숫자를 입력해주세요." },
        setVerificationCode: jest.fn(),
        validateVerificationCode: jest.fn(),
      }),
    }));

    const { result } = renderHook(() => useVerificationCodeFlow(mockEmail));

    act(() => {
      result.current.setVerificationCode("12345");
    });

    expect(result.current.verificationCodeValidation.state).toBe("ERROR");
    if (result.current.verificationCodeValidation.state === "ERROR") {
      expect(result.current.verificationCodeValidation.errorText).toBe("6자리 숫자를 입력해주세요.");
    }
  });

  it("인증번호 검증이 성공한다", async () => {
    const mockOnSuccess = jest.fn();
    const mockVerifyCodeRequest = jest.fn().mockResolvedValue({ token: "test-token" });
    const mockSaveToken = jest.fn();

    jest.doMock("@hongpung/src/entities/auth", () => ({
      useVerifyResetPasswordVerificationCodeRequest: () => ({
        request: mockVerifyCodeRequest,
        isLoading: false,
        error: null,
      }),
    }));

    jest.doMock("@hongpung/src/common", () => ({
      saveToken: mockSaveToken,
    }));

    jest.doMock("@hongpung/src/common/lib/useValidatedForm", () => ({
      useValidatedForm: () => ({
        verificationCode: "123456",
        verificationCodeValidation: { state: "VALID" },
        setVerificationCode: jest.fn(),
        validateVerificationCode: jest.fn(),
      }),
    }));

    const { result } = renderHook(() => useVerificationCodeFlow(mockEmail));

    await act(async () => {
      await result.current.verifyCode({ onSuccess: mockOnSuccess });
    });

    expect(mockVerifyCodeRequest).toHaveBeenCalledWith({
      code: "123456",
      email: mockEmail,
    });
    expect(mockSaveToken).toHaveBeenCalledWith("oneTimeToken", "test-token");
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("인증번호 길이가 6자리가 아닐 때 검증 실패한다", async () => {
    const mockValidateVerificationCodeForm = jest.fn();

    jest.doMock("@hongpung/src/common/lib/useValidatedForm", () => ({
      useValidatedForm: () => ({
        verificationCode: "12345",
        verificationCodeValidation: { state: "ERROR" },
        setVerificationCode: jest.fn(),
        validateVerificationCode: mockValidateVerificationCodeForm,
      }),
    }));

    const { result } = renderHook(() => useVerificationCodeFlow(mockEmail));
    const mockOnSuccess = jest.fn();

    await act(async () => {
      await result.current.verifyCode({ onSuccess: mockOnSuccess });
    });

    expect(mockValidateVerificationCodeForm).toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("인증번호 검증 실패 시 에러를 throw한다", async () => {
    const mockVerifyCodeRequest = jest.fn().mockRejectedValue(new Error("인증번호가 올바르지 않습니다"));

    jest.doMock("@hongpung/src/entities/auth", () => ({
      useVerifyResetPasswordVerificationCodeRequest: () => ({
        request: mockVerifyCodeRequest,
        isLoading: false,
        error: new Error("인증번호가 올바르지 않습니다"),
      }),
    }));

    jest.doMock("@hongpung/src/common/lib/useValidatedForm", () => ({
      useValidatedForm: () => ({
        verificationCode: "123456",
        verificationCodeValidation: { state: "VALID" },
        setVerificationCode: jest.fn(),
        validateVerificationCode: jest.fn(),
      }),
    }));

    const { result } = renderHook(() => useVerificationCodeFlow(mockEmail));
    const mockOnSuccess = jest.fn();

    await expect(
      result.current.verifyCode({ onSuccess: mockOnSuccess })
    ).rejects.toThrow("인증번호가 올바르지 않습니다");

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("토큰이 없을 때 에러를 throw한다", async () => {
    const mockVerifyCodeRequest = jest.fn().mockResolvedValue({});

    jest.doMock("@hongpung/src/entities/auth", () => ({
      useVerifyResetPasswordVerificationCodeRequest: () => ({
        request: mockVerifyCodeRequest,
        isLoading: false,
        error: null,
      }),
    }));

    jest.doMock("@hongpung/src/common/lib/useValidatedForm", () => ({
      useValidatedForm: () => ({
        verificationCode: "123456",
        verificationCodeValidation: { state: "VALID" },
        setVerificationCode: jest.fn(),
        validateVerificationCode: jest.fn(),
      }),
    }));

    const { result } = renderHook(() => useVerificationCodeFlow(mockEmail));
    const mockOnSuccess = jest.fn();

    await expect(
      result.current.verifyCode({ onSuccess: mockOnSuccess })
    ).rejects.toThrow("토큰을 받지 못했어요");
  });

  it("인증번호 blur 이벤트가 정상 동작한다", () => {
    const mockValidateVerificationCodeForm = jest.fn();

    jest.doMock("@hongpung/src/common/lib/useValidatedForm", () => ({
      useValidatedForm: () => ({
        verificationCode: "123456",
        verificationCodeValidation: { state: "VALID" },
        setVerificationCode: jest.fn(),
        validateVerificationCode: mockValidateVerificationCodeForm,
      }),
    }));

    const { result } = renderHook(() => useVerificationCodeFlow(mockEmail));

    act(() => {
      result.current.onVerificationCodeBlur();
    });

    expect(mockValidateVerificationCodeForm).toHaveBeenCalled();
  });

  it("인증 가능 상태를 올바르게 계산한다", () => {
    jest.doMock("@hongpung/src/common/lib/useValidatedForm", () => ({
      useValidatedForm: () => ({
        verificationCode: "123456",
        verificationCodeValidation: { state: "VALID" },
        setVerificationCode: jest.fn(),
        validateVerificationCode: jest.fn(),
      }),
    }));

    const { result } = renderHook(() => useVerificationCodeFlow(mockEmail));

    expect(result.current.isCanVerifyCode).toBe(true);
  });

  it("ref 객체가 올바르게 생성된다", () => {
    const { result } = renderHook(() => useVerificationCodeFlow(mockEmail));

    expect(result.current.verificationCodeRef).toBeDefined();
    expect(result.current.verificationCodeRef.current).toBe(null);
  });

  it("validateVerificationCode 함수가 정상 동작한다", () => {
    const mockValidateVerificationCodeForm = jest.fn();

    jest.doMock("@hongpung/src/common/lib/useValidatedForm", () => ({
      useValidatedForm: () => ({
        verificationCode: "123456",
        verificationCodeValidation: { state: "VALID" },
        setVerificationCode: jest.fn(),
        validateVerificationCode: mockValidateVerificationCodeForm,
      }),
    }));

    const { result } = renderHook(() => useVerificationCodeFlow(mockEmail));

    act(() => {
      result.current.validateVerificationCode("123456");
    });

    expect(mockValidateVerificationCodeForm).toHaveBeenCalled();
  });
}); 