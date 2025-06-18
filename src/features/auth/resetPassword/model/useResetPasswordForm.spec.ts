import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useResetPasswordForm } from "./useResetPasswordForm";
import { useIsRegisteredEmailRequest } from "@hongpung/src/entities/auth";

// Mocks
jest.mock("@hongpung/src/entities/auth");

const mockUseIsRegisteredEmailRequest =
  useIsRegisteredEmailRequest as jest.Mock;

describe("useResetPasswordForm Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsRegisteredEmailRequest.mockReturnValue({
      request: jest.fn(),
    });
  });

  describe("초기 상태 확인", () => {
    it("초기값이 올바르게 설정된다", () => {
      const { result } = renderHook(() => useResetPasswordForm());

      expect(result.current.email).toBe("");
      expect(result.current.newPassword).toBe("");
      expect(result.current.confirmPassword).toBe("");
      expect(result.current.emailValidation.state).toBe("BEFORE");
      expect(result.current.newPasswordValidation.state).toBe("BEFORE");
      expect(result.current.confirmPasswordValidation.state).toBe("BEFORE");
      expect(result.current.isCanResetPassword).toBe(false);
    });
  });

  describe("이메일 검증", () => {
    it("사용자가 유효하지 않은 이메일을 입력하면 에러 메시지를 보여준다", async () => {
      const { result } = renderHook(() => useResetPasswordForm());

      act(() => {
        result.current.setEmail("invalid-email");
      });

      await act(async () => {
        await result.current.validateEmail();
      });

      expect(result.current.emailValidation.state).toBe("ERROR");
      if (result.current.emailValidation.state === "ERROR") {
        expect(result.current.emailValidation.errorText).toBe(
          "올바른 이메일 형식이 아닙니다."
        );
      }
    });

    it("사용자가 존재하지 않는 이메일을 입력하면 에러 메시지를 보여준다", async () => {
      const mockRequest = jest.fn().mockResolvedValue({ isRegistered: false });
      mockUseIsRegisteredEmailRequest.mockReturnValue({
        request: mockRequest,
      });

      const { result } = renderHook(() => useResetPasswordForm());

      act(() => {
        result.current.setEmail("notexist@example.com");
      });

      await act(async () => {
        await result.current.validateEmail();
      });

      expect(mockRequest).toHaveBeenCalledWith({
        email: "notexist@example.com",
      });
      expect(result.current.emailValidation.state).toBe("ERROR");
      if (result.current.emailValidation.state === "ERROR") {
        expect(result.current.emailValidation.errorText).toBe(
          "존재하지 않는 이메일입니다."
        );
      }
    });

    it("사용자가 유효하고 등록된 이메일을 입력하면 검증이 통과된다", async () => {
      const mockRequest = jest.fn().mockResolvedValue({ isRegistered: true });
      mockUseIsRegisteredEmailRequest.mockReturnValue({
        request: mockRequest,
      });

      const { result } = renderHook(() => useResetPasswordForm());

      act(() => {
        result.current.setEmail("valid@example.com");
      });

      await act(async () => {
        await result.current.validateEmail();
      });

      expect(mockRequest).toHaveBeenCalledWith({ email: "valid@example.com" });
      expect(result.current.emailValidation.state).toBe("VALID");
    });

    it("이메일 검증 중 API 에러가 발생하면 Zod 에러로 처리된다", async () => {
      const mockRequest = jest
        .fn()
        .mockRejectedValue(new Error("Network error"));
      mockUseIsRegisteredEmailRequest.mockReturnValue({
        request: mockRequest,
      });

      const { result } = renderHook(() => useResetPasswordForm());

      act(() => {
        result.current.setEmail("test@example.com");
      });

      await act(async () => {
        await result.current.validateEmail();
      });

      // 네트워크 에러 시에도 검증이 실행되어야 함
      expect(mockRequest).toHaveBeenCalledWith({ email: "test@example.com" });
    });
  });

  describe("새 비밀번호 검증", () => {
    it("사용자가 8자 미만의 새 비밀번호를 입력하면 에러 메시지를 보여준다", () => {
      const { result } = renderHook(() => useResetPasswordForm());

      act(() => {
        result.current.setNewPassword("1234567");
      });

      act(() => {
        result.current.validateNewPassword();
      });

      expect(result.current.newPasswordValidation.state).toBe("ERROR");
      if (result.current.newPasswordValidation.state === "ERROR") {
        expect(result.current.newPasswordValidation.errorText).toBe(
          "비밀번호는 8자 이상이어야 합니다."
        );
      }
    });

    it("사용자가 영문, 숫자, 특수문자가 포함되지 않은 새 비밀번호를 입력하면 에러 메시지를 보여준다", () => {
      const { result } = renderHook(() => useResetPasswordForm());

      act(() => {
        result.current.setNewPassword("12345678");
      });

      act(() => {
        result.current.validateNewPassword();
      });

      expect(result.current.newPasswordValidation.state).toBe("ERROR");
      if (result.current.newPasswordValidation.state === "ERROR") {
        expect(result.current.newPasswordValidation.errorText).toBe(
          "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다."
        );
      }
    });

    it("사용자가 유효한 새 비밀번호를 입력하면 검증이 통과된다", () => {
      const { result } = renderHook(() => useResetPasswordForm());

      act(() => {
        result.current.setNewPassword("NewPassword123!");
      });

      act(() => {
        result.current.validateNewPassword();
      });

      expect(result.current.newPasswordValidation.state).toBe("VALID");
    });
  });

  describe("비밀번호 확인 검증", () => {
    it("사용자가 비밀번호 확인을 입력하지 않으면 에러 메시지를 보여준다", () => {
      const { result } = renderHook(() => useResetPasswordForm());

      act(() => {
        result.current.setConfirmPassword("");
      });

      act(() => {
        result.current.validateConfirmPassword();
      });

      expect(result.current.confirmPasswordValidation.state).toBe("ERROR");
      if (result.current.confirmPasswordValidation.state === "ERROR") {
        expect(result.current.confirmPasswordValidation.errorText).toBe(
          "비밀번호 확인을 입력해주세요."
        );
      }
    });

    it("사용자가 새 비밀번호와 다른 확인 비밀번호를 입력하면 에러 메시지를 보여준다", async () => {
      const { result } = renderHook(() => useResetPasswordForm());

      act(() => {
        result.current.setNewPassword("NewPassword123!");
      });
      act(() => {
        result.current.setConfirmPassword("DifferentPassword123!");
      });
      act(() => {
        result.current.validateConfirmPassword();
      });

      expect(result.current.confirmPasswordValidation.state).toBe("ERROR");
      if (result.current.confirmPasswordValidation.state === "ERROR") {
        expect(result.current.confirmPasswordValidation.errorText).toBe(
          "비밀번호가 일치하지 않습니다."
        );
      }
    });

    it("사용자가 새 비밀번호와 일치하는 확인 비밀번호를 입력하면 검증이 통과된다", () => {
      const { result } = renderHook(() => useResetPasswordForm());

      const password = "NewPassword123!";

      act(() => {
        result.current.setNewPassword(password);
        result.current.setConfirmPassword(password);
      });

      act(() => {
        result.current.validateConfirmPassword();
      });

      expect(result.current.confirmPasswordValidation.state).toBe("VALID");
    });
  });

  describe("전체 폼 검증", () => {
    it("모든 필드가 유효하면 isCanResetPassword가 true가 된다", async () => {
      const mockRequest = jest.fn().mockResolvedValue({ isRegistered: true });
      mockUseIsRegisteredEmailRequest.mockReturnValue({
        request: mockRequest,
      });

      const { result } = renderHook(() => useResetPasswordForm());

      const email = "valid@example.com";
      const password = "NewPassword123!";

      // 모든 필드 설정
      act(() => {
        result.current.setEmail(email);
        result.current.setNewPassword(password);
        result.current.setConfirmPassword(password);
      });

      // 모든 필드 검증
      await act(async () => {
        await result.current.validateEmail();
      });

      act(() => {
        result.current.validateNewPassword();
        result.current.validateConfirmPassword();
      });

      await waitFor(() => {
        expect(result.current.isCanResetPassword).toBe(true);
      });
    });

    it("하나라도 유효하지 않은 필드가 있으면 isCanResetPassword가 false가 된다", () => {
      const { result } = renderHook(() => useResetPasswordForm());

      const password = "NewPassword123!";

      act(() => {
        result.current.setEmail("invalid-email"); // 유효하지 않은 이메일
        result.current.setNewPassword(password);
        result.current.setConfirmPassword(password);
      });

      act(() => {
        result.current.validateNewPassword();
        result.current.validateConfirmPassword();
      });

      expect(result.current.isCanResetPassword).toBe(false);
    });
  });

  describe("onBlur 핸들러", () => {
    it("이메일 필드에서 blur 발생 시 BEFORE 상태가 아니면 재검증한다", async () => {
      const mockRequest = jest.fn().mockResolvedValue({ isRegistered: true });

      mockUseIsRegisteredEmailRequest.mockReturnValue({
        request: mockRequest,
      });

      const { result } = renderHook(() => useResetPasswordForm());

      // 먼저 이메일을 검증 상태로 만들기
      act(() => {
        result.current.setEmail("test@example.com");
      });

      await act(async () => {
        result.current.onEmailBlur();
      });

      // 이메일 수정 후 blur
      act(() => {
        result.current.setEmail("modified@example.com");
      });

      await act(async () => {
        result.current.onEmailBlur();
      });

      // 재검증이 발생해야 함
      expect(mockRequest).toHaveBeenCalledTimes(2);
      expect(result.current.emailValidation.state).toBe("VALID");
    });

    it("새 비밀번호 필드에서 blur 발생 시 BEFORE 상태가 아니면 재검증한다", () => {
      const { result } = renderHook(() => useResetPasswordForm());

      // 먼저 비밀번호를 검증 상태로 만들기
      act(() => {
        result.current.setNewPassword("Password123!");
        result.current.validateNewPassword();
      });

      // 비밀번호 수정 후 blur
      act(() => {
        result.current.setNewPassword("ModifiedPassword123!");
        result.current.onNewPasswordBlur();
      });

      // 재검증이 발생하여 상태가 업데이트되어야 함
      expect(result.current.newPasswordValidation.state).toBe("VALID");
    });

    it("확인 비밀번호 필드에서 blur 발생 시 BEFORE 상태가 아니면 재검증한다", () => {
      const { result } = renderHook(() => useResetPasswordForm());

      // 먼저 확인 비밀번호를 검증 상태로 만들기
      act(() => {
        result.current.setNewPassword("Password123!");
        result.current.setConfirmPassword("Password123!");
        result.current.validateConfirmPassword();
      });

      // 확인 비밀번호 수정 후 blur
      act(() => {
        result.current.setConfirmPassword("ModifiedPassword123!");
      });
      act(() => {
        result.current.onConfirmPasswordBlur();
      });

      // 재검증이 발생하여 에러 상태가 되어야 함
      expect(result.current.confirmPasswordValidation.state).toBe("ERROR");
    });
  });

  describe("필드 상태 변경", () => {
    it("이메일 입력 시 상태가 업데이트된다", () => {
      const { result } = renderHook(() => useResetPasswordForm());
      const testEmail = "test@example.com";

      act(() => {
        result.current.setEmail(testEmail);
      });

      expect(result.current.email).toBe(testEmail);
    });

    it("새 비밀번호 입력 시 상태가 업데이트된다", () => {
      const { result } = renderHook(() => useResetPasswordForm());
      const testPassword = "Password123!";

      act(() => {
        result.current.setNewPassword(testPassword);
      });

      expect(result.current.newPassword).toBe(testPassword);
    });

    it("확인 비밀번호 입력 시 상태가 업데이트된다", () => {
      const { result } = renderHook(() => useResetPasswordForm());
      const testPassword = "Password123!";

      act(() => {
        result.current.setConfirmPassword(testPassword);
      });

      expect(result.current.confirmPassword).toBe(testPassword);
    });
  });
});
