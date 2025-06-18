import { renderHook, act } from "@testing-library/react-native";
import { useSignUpSteps } from "./useSignUpSteps";
import { clubNames } from "@hongpung/src/entities/club";

// Navigation 모킹
const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

// API 로직 모킹
const mockSignUpRequest = jest.fn();
const mockSendVerificationCode = jest.fn();
const mockVerifyCode = jest.fn();
const mockIsRegisteredEmail = jest.fn();

jest.mock("@hongpung/src/entities/auth", () => ({
  useSignUpRequest: () => ({
    request: mockSignUpRequest,
    isLoading: false,
    error: null,
  }),
  useSendSignUpVerificationCodeRequest: () => ({
    request: mockSendVerificationCode,
    isLoading: false,
    error: null,
  }),
  useVerifySignUpVerificationCodeRequest: () => ({
    request: mockVerifyCode,
    isLoading: false,
    error: null,
  }),
  useIsRegisteredEmailRequest: () => ({
    request: mockIsRegisteredEmail,
    isLoading: false,
  }),
}));

// Common 모킹
const mockAlert = {
  alert: jest.fn(),
  confirm: jest.fn(),
};

const mockUseValidatedForm = jest.fn(() => ({
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  club: null,
  enrollmentNumber: "",
  nickname: "",
  emailValidation: { state: "BEFORE" },
  passwordValidation: { state: "BEFORE" },
  confirmPasswordValidation: { state: "BEFORE" },
  nameValidation: { state: "BEFORE" },
  clubValidation: { state: "BEFORE" },
  enrollmentNumberValidation: { state: "BEFORE" },
  nicknameValidation: { state: "BEFORE" },
  setEmail: jest.fn(),
  setPassword: jest.fn(),
  setConfirmPassword: jest.fn(),
  setName: jest.fn(),
  setClub: jest.fn(),
  setEnrollmentNumber: jest.fn(),
  setNickname: jest.fn(),
  validateEmail: jest.fn(),
  validatePassword: jest.fn(),
  validateConfirmPassword: jest.fn(),
  validateName: jest.fn(),
  validateClub: jest.fn(),
  validateEnrollmentNumber: jest.fn(),
  validateNickname: jest.fn(),
}));

jest.mock("@hongpung/src/common", () => ({
  ...jest.requireActual("@hongpung/src/common"),
  Alert: mockAlert,
  useValidatedForm: mockUseValidatedForm,
}));

// Toast 모킹
jest.mock("../lib/toast", () => ({
  onSignUpSuccessToast: jest.fn(),
}));

// React Native 모킹
jest.mock("react-native", () => ({
  ...jest.requireActual("react-native"),
  BackHandler: {
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  },
}));

describe("useSignUpSteps 테스트", () => {
  const mockNavigateToLoginPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("초기 상태 테스트", () => {
    it("초기 스텝이 EmailConfirm으로 설정된다", () => {
      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      expect(result.current.step).toBe("EmailConfirm");
      expect(result.current.isSendingCode).toBe(false);
      expect(result.current.verificationCode).toBe("");
      expect(result.current.verificationCodeValidation.state).toBe("BEFORE");
      expect(result.current.isClubOptionsVisible).toBe(false);
    });
  });

  describe("스텝 진행 조건 테스트", () => {
    it("EmailConfirm 단계에서는 이메일 검증이 완료되어야 다음 단계로 진행 가능하다", () => {
      const mockForm = {
        emailValidation: { state: "VALID" },
        passwordValidation: { state: "BEFORE" },
        confirmPasswordValidation: { state: "BEFORE" },
        nameValidation: { state: "BEFORE" },
        enrollmentNumberValidation: { state: "BEFORE" },
      };

      mockUseValidatedForm.mockReturnValue({
        ...mockUseValidatedForm(),
        ...mockForm,
      });

      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      act(() => {
        result.current.setStep("EmailConfirm");
      });

      expect(result.current.isCanNextStep).toBe(true);
    });

    it("SetPassword 단계에서는 이메일, 비밀번호, 비밀번호 확인이 모두 검증되어야 한다", () => {
      const mockForm = {
        emailValidation: { state: "VALID" },
        passwordValidation: { state: "VALID" },
        confirmPasswordValidation: { state: "VALID" },
        nameValidation: { state: "BEFORE" },
        enrollmentNumberValidation: { state: "BEFORE" },
      };

      mockUseValidatedForm.mockReturnValue({
        ...mockUseValidatedForm(),
        ...mockForm,
      });

      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      act(() => {
        result.current.setStep("SetPassword");
      });

      expect(result.current.isCanNextStep).toBe(true);
    });

    it("PersonalInfo 단계에서는 모든 필드가 검증되어야 한다", () => {
      const mockForm = {
        emailValidation: { state: "VALID" },
        passwordValidation: { state: "VALID" },
        confirmPasswordValidation: { state: "VALID" },
        nameValidation: { state: "VALID" },
        enrollmentNumberValidation: { state: "VALID" },
      };

      mockUseValidatedForm.mockReturnValue({
        ...mockUseValidatedForm(),
        ...mockForm,
      });

      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      act(() => {
        result.current.setStep("PersonalInfo");
      });

      expect(result.current.isCanNextStep).toBe(true);
    });
  });

  describe("이메일 인증 테스트", () => {
    it("사용자가 이메일 인증 코드 발송을 요청할 수 있다", async () => {
      const mockForm = {
        email: "test@example.com",
        emailValidation: { state: "VALID" },
        validateEmail: jest.fn(),
      };

      mockUseValidatedForm.mockReturnValue({
        ...mockUseValidatedForm(),
        ...mockForm,
      });

      mockSendVerificationCode.mockResolvedValueOnce({});

      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      await act(async () => {
        await result.current.sendVerificationCode();
      });

      expect(mockForm.validateEmail).toHaveBeenCalled();
      expect(mockSendVerificationCode).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(result.current.isSendingCode).toBe(true);
    });

    it("이메일이 유효하지 않으면 인증 코드를 발송하지 않는다", async () => {
      const mockForm = {
        email: "invalid-email",
        emailValidation: { state: "ERROR" },
        validateEmail: jest.fn(),
      };

      mockUseValidatedForm.mockReturnValue({
        ...mockUseValidatedForm(),
        ...mockForm,
      });

      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      await act(async () => {
        await result.current.sendVerificationCode();
      });

      expect(mockSendVerificationCode).not.toHaveBeenCalled();
    });

    it("사용자가 6자리 인증 코드를 입력하면 검증이 성공한다", async () => {
      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      act(() => {
        result.current.setVerificationCode("123456");
      });

      await act(async () => {
        await result.current.validateVerificationCode("123456");
      });

      expect(result.current.verificationCodeValidation.state).toBe("VALID");
    });

    it("사용자가 6자리가 아닌 인증 코드를 입력하면 에러가 발생한다", async () => {
      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      await act(async () => {
        await result.current.validateVerificationCode("12345");
      });

      expect(result.current.verificationCodeValidation).toEqual({
        state: "ERROR",
        errorText: "6자리 숫자를 입력해주세요.",
      });
    });

    it("사용자가 올바른 인증 코드로 검증을 완료할 수 있다", async () => {
      const mockForm = {
        email: "test@example.com",
      };

      mockUseValidatedForm.mockReturnValue({
        ...mockUseValidatedForm(),
        ...mockForm,
      });

      mockVerifyCode.mockResolvedValueOnce({});
      const mockOnSuccess = jest.fn();

      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      act(() => {
        result.current.setVerificationCode("123456");
      });

      await act(async () => {
        await result.current.verifyCode({ onSuccess: mockOnSuccess });
      });

      expect(mockVerifyCode).toHaveBeenCalledWith({
        code: "123456",
        email: "test@example.com",
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  describe("회원가입 완료 테스트", () => {
    it("사용자가 모든 정보를 올바르게 입력하면 회원가입이 성공한다", async () => {
      const mockForm = {
        email: "test@example.com",
        password: "password123@",
        name: "홍길동",
        nickname: "길동",
        club: clubNames[0],
        enrollmentNumber: "24",
      };

      mockUseValidatedForm.mockReturnValue({
        ...mockUseValidatedForm(),
        ...mockForm,
      });

      mockSignUpRequest.mockResolvedValueOnce({});

      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      act(() => {
        result.current.setStep("PersonalInfo");
      });

      await act(async () => {
        await result.current.onSubmit();
      });

      expect(mockSignUpRequest).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123@",
        name: "홍길동",
        nickname: "길동",
        clubId: 0,
        enrollmentNumber: "24",
      });
      expect(mockNavigateToLoginPage).toHaveBeenCalled();
    });

    it("유효하지 않은 동아리가 선택되면 에러가 발생한다", async () => {
      const mockForm = {
        club: "존재하지않는동아리",
        email: "test@example.com",
        password: "password123@",
        name: "홍길동",
        nickname: "길동",
        enrollmentNumber: "24",
      };

      mockUseValidatedForm.mockReturnValue({
        ...mockUseValidatedForm(),
        ...mockForm,
      });

      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      act(() => {
        result.current.setStep("PersonalInfo");
      });

      await act(async () => {
        await result.current.onSubmit();
      });

      expect(mockSignUpRequest).not.toHaveBeenCalled();
      expect(mockAlert.alert).toHaveBeenCalledWith(
        "회원가입 실패",
        "유효하지 않은 동아리입니다."
      );
    });
  });

  describe("동아리 선택 테스트", () => {
    it("사용자가 동아리 옵션을 열고 닫을 수 있다", () => {
      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      act(() => {
        result.current.setIsClubOptionsVisible(true);
      });

      expect(result.current.isClubOptionsVisible).toBe(true);

      act(() => {
        result.current.dissmissClubOptions();
      });

      expect(result.current.isClubOptionsVisible).toBe(false);
    });
  });

  describe("회원가입 취소 테스트", () => {
    it("사용자가 회원가입을 취소하면 확인 다이얼로그가 표시된다", () => {
      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      act(() => {
        result.current.onClose();
      });

      expect(mockAlert.confirm).toHaveBeenCalledWith(
        "확인",
        "회원가입을 취소하고 뒤로 돌아갈까요?",
        expect.objectContaining({
          cancelText: "아니오",
          confirmText: "네",
          cancelButtonColor: "green",
          confirmButtonColor: "green",
          onConfirm: expect.any(Function),
        })
      );
    });
  });

  describe("에러 처리 테스트", () => {
    it("회원가입 API 요청이 실패하면 적절한 에러 메시지를 표시한다", async () => {
      const mockForm = {
        email: "test@example.com",
        password: "password123@",
        name: "홍길동",
        nickname: "길동",
        club: clubNames[0],
        enrollmentNumber: "24",
      };

      mockUseValidatedForm.mockReturnValue({
        ...mockUseValidatedForm(),
        ...mockForm,
      });

      mockSignUpRequest.mockRejectedValueOnce(new Error("서버 오류"));

      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      act(() => {
        result.current.setStep("PersonalInfo");
      });

      await act(async () => {
        await result.current.onSubmit();
      });

      expect(mockAlert.alert).toHaveBeenCalledWith("회원가입 실패", "서버 오류");
    });

    it("인증 코드 발송이 실패하면 isSendingCode가 false로 설정된다", async () => {
      const mockForm = {
        email: "test@example.com",
        emailValidation: { state: "VALID" },
        validateEmail: jest.fn(),
      };

      mockUseValidatedForm.mockReturnValue({
        ...mockUseValidatedForm(),
        ...mockForm,
      });

      mockSendVerificationCode.mockRejectedValueOnce(new Error("발송 실패"));

      const { result } = renderHook(() =>
        useSignUpSteps({ navigateToLoginPage: mockNavigateToLoginPage })
      );

      await act(async () => {
        await result.current.sendVerificationCode();
      });

      expect(result.current.isSendingCode).toBe(true);
    });
  });
}); 