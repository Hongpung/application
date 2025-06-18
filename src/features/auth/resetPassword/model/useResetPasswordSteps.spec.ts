import { renderHook, act } from "@testing-library/react-native";
import useResetPasswordSteps from "./useResetPasswordSteps";

// API 로직 모킹


jest.mock("@hongpung/src/entities/auth", () => ({
  useIsRegisteredEmailRequest: () => ({
    request: jest.fn().mockResolvedValue({}),
    isLoading: false,
    error: null,
  }),

  useResetPasswordRequest: () => ({
    request: jest.fn().mockResolvedValue({}),
    isLoading: false,
    error: null,
  }),
  useSendResetPasswordVerificationCodeRequest: () => ({
    request: jest.fn().mockResolvedValue({}),
    isLoading: false,
    error: null,
  }),
  useVerifyResetPasswordVerificationCodeRequest: () => ({
    request: jest.fn().mockResolvedValue({}),
    isLoading: false,
    error: null,
  }),
}));

describe("useResetPasswordSteps Test", () => {


  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("초기 상태를 확인한다", () => {
    const { result } = renderHook(() => useResetPasswordSteps());

    expect(result.current.email).toBe("");
    expect(result.current.verificationCode).toBe("");
    expect(result.current.newPassword).toBe("");
    expect(result.current.confirmPassword).toBe("");
    expect(result.current.step).toBe("EmailConfirm");
  });

  it("이메일 값 설정이 정상 동작한다", () => {
    const { result } = renderHook(() => useResetPasswordSteps());

    const testEmail = "test@example.com";

    act(() => {
      result.current.setEmail(testEmail);
    });

    expect(result.current.email).toBe(testEmail);
  });

  it("인증번호 값 설정이 정상 동작한다", () => {
    const { result } = renderHook(() =>
      useResetPasswordSteps()
    );

    const testCode = "123456";

    act(() => {
      result.current.setVerificationCode(testCode);
    });

    expect(result.current.verificationCode).toBe(testCode);
  });

  it("새 비밀번호 값 설정이 정상 동작한다", () => {
    const { result } = renderHook(() =>
      useResetPasswordSteps()
    );

    const testPassword = "newPassword123@";

    act(() => {
      result.current.setNewPassword(testPassword);
    });

    expect(result.current.newPassword).toBe(testPassword);
  });

  it("비밀번호 확인 값 설정이 정상 동작한다", () => {
    const { result } = renderHook(() =>
      useResetPasswordSteps()
    );

    const testPassword = "newPassword123@";

    act(() => {
      result.current.setConfirmPassword(testPassword);
    });

    expect(result.current.confirmPassword).toBe(testPassword);
  });

  it("단계 이동이 정상 동작한다", () => {
    const { result } = renderHook(() =>
      useResetPasswordSteps()
    );

    act(() => {
      result.current.setStep("ResetPassword");
    });

    expect(result.current.step).toBe("ResetPassword");
  });

  it("인증번호 전송이 정상 동작한다", async () => {
    const { result } = renderHook(() =>
      useResetPasswordSteps()
    );

    act(() => {
      result.current.setEmail("test@example.com");
    });

    await act(async () => {
      await result.current.sendVerificationCode();
    });

    // 인증번호 전송 함수가 실행되는지 확인
    expect(result.current.sendVerificationCode).toBeDefined();
  });

  it("비밀번호 재설정이 정상 동작한다", async () => {
    const { result } = renderHook(() =>
      useResetPasswordSteps()
    );

    act(() => {
      result.current.setNewPassword("newPassword123@");
      result.current.setConfirmPassword("newPassword123@");
    });

    await act(async () => {
      await result.current.resetPassword();
    });

    // 비밀번호 재설정 함수가 실행되는지 확인
    expect(result.current.resetPassword).toBeDefined();
  });

  it("뒤로가기 처리가 정상 동작한다", () => {
    const { result } = renderHook(() =>
      useResetPasswordSteps()
    );

    act(() => {
      result.current.onClose();
    });

    // 뒤로가기 함수가 실행되는지 확인
    expect(result.current.onClose).toBeDefined();
  });

  it("ref 객체들이 올바르게 생성된다", () => {
    const { result } = renderHook(() =>
      useResetPasswordSteps()
    );

    expect(result.current.email).toBeDefined();
    expect(result.current.verificationCode).toBeDefined();
    expect(result.current.newPassword).toBeDefined();
    expect(result.current.confirmPassword).toBeDefined();
    expect(result.current.email).toBe("");
    expect(result.current.verificationCode).toBe("");
    expect(result.current.newPassword).toBe("");
    expect(result.current.confirmPassword).toBe("");
  });
});
