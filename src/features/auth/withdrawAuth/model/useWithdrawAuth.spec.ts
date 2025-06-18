import { renderHook, act } from "@testing-library/react-native";
import { useValidatedForm } from "@hongpung/src/common";
import { useWithdrawRequest } from "@hongpung/src/entities/auth";
import { useWithdrawAuth } from "./useWithdrawAuth";
import { withdrawalSchema } from "./withdrawalSchema";
import * as z from "zod";

// Mock dependencies
jest.mock("@hongpung/src/common");
jest.mock("@hongpung/src/entities/auth");

const mockUseValidatedForm = useValidatedForm as jest.MockedFunction<typeof useValidatedForm>;
const mockUseWithdrawRequest = useWithdrawRequest as jest.MockedFunction<typeof useWithdrawRequest>;

describe("useWithdrawAuth", () => {
  const mockWithdrawRequest = jest.fn();
  const mockTextInputRef = { current: { focus: jest.fn() } } as any;

  const mockFormData = {
    confirmword: "",
    setConfirmword: jest.fn(),
    confirmwordValidation: { state: "BEFORE" as const },
    validateConfirmword: jest.fn(),

    currentPassword: "",
    setCurrentPassword: jest.fn(),
    currentPasswordValidation: { state: "BEFORE" as const },
    validateCurrentPassword: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseWithdrawRequest.mockReturnValue({
      request: mockWithdrawRequest,
      isLoading: false,
    });

    mockUseValidatedForm.mockReturnValue(mockFormData);
  });

  describe("초기 상태", () => {
    it("초기화 시 올바른 기본값들을 반환한다", () => {
      const { result } = renderHook(() => useWithdrawAuth());

      expect(result.current.confirmword).toBe("");
      expect(result.current.currentPassword).toBe("");
      expect(result.current.confirmwordValidation.state).toBe("BEFORE");
      expect(result.current.currentPasswordValidation.state).toBe("BEFORE");
      expect(result.current.isCanWithdraw).toBe(false);
    });

    it("useValidatedForm이 올바른 파라미터로 호출된다", () => {
      renderHook(() => useWithdrawAuth());

      expect(mockUseValidatedForm).toHaveBeenCalledWith({
        schema: withdrawalSchema,
        defaultValues: {
          confirmword: "",
          currentPassword: "",
        },
      });
    });
  });

  describe("폼 유효성 검증", () => {
    it("모든 필드가 유효하면 isCanWithdraw가 true가 된다", () => {
      mockUseValidatedForm.mockReturnValue({
        ...mockFormData,
        confirmwordValidation: { state: "VALID" },
        currentPasswordValidation: { state: "VALID" },
      });

      const { result } = renderHook(() => useWithdrawAuth());

      expect(result.current.isCanWithdraw).toBe(true);
    });

    it("confirmword가 유효하지 않으면 isCanWithdraw가 false가 된다", () => {
      mockUseValidatedForm.mockReturnValue({
        ...mockFormData,
        confirmwordValidation: { state: "ERROR", errorText: "잘못된 확인 문자" },
        currentPasswordValidation: { state: "VALID" },
      });

      const { result } = renderHook(() => useWithdrawAuth());

      expect(result.current.isCanWithdraw).toBe(false);
    });

    it("currentPassword가 유효하지 않으면 isCanWithdraw가 false가 된다", () => {
      mockUseValidatedForm.mockReturnValue({
        ...mockFormData,
        confirmwordValidation: { state: "VALID" },
        currentPasswordValidation: { state: "ERROR", errorText: "비밀번호 오류" },
      });

      const { result } = renderHook(() => useWithdrawAuth());

      expect(result.current.isCanWithdraw).toBe(false);
    });
  });

  describe("onBlur 핸들러", () => {
    it("currentPassword가 BEFORE 상태가 아닐 때 blur 시 검증 함수를 호출한다", () => {
      const mockValidateCurrentPassword = jest.fn();
      mockUseValidatedForm.mockReturnValue({
        ...mockFormData,
        currentPasswordValidation: { state: "VALID" },
        validateCurrentPassword: mockValidateCurrentPassword,
      });

      const { result } = renderHook(() => useWithdrawAuth());

      act(() => {
        result.current.onCurrentPasswordBlur();
      });

      expect(mockValidateCurrentPassword).toHaveBeenCalled();
    });

    it("currentPassword가 BEFORE 상태일 때 blur 시 검증 함수를 호출하지 않는다", () => {
      const mockValidateCurrentPassword = jest.fn();
      mockUseValidatedForm.mockReturnValue({
        ...mockFormData,
        currentPasswordValidation: { state: "BEFORE" },
        validateCurrentPassword: mockValidateCurrentPassword,
      });

      const { result } = renderHook(() => useWithdrawAuth());

      act(() => {
        result.current.onCurrentPasswordBlur();
      });

      expect(mockValidateCurrentPassword).not.toHaveBeenCalled();
    });

    it("confirmword가 BEFORE 상태가 아닐 때 blur 시 검증 함수를 호출한다", () => {
      const mockValidateConfirmword = jest.fn();
      mockUseValidatedForm.mockReturnValue({
        ...mockFormData,
        confirmwordValidation: { state: "ERROR", errorText: "에러" },
        validateConfirmword: mockValidateConfirmword,
      });

      const { result } = renderHook(() => useWithdrawAuth());

      act(() => {
        result.current.onConfirmwordBlur();
      });

      expect(mockValidateConfirmword).toHaveBeenCalled();
    });
  });

  describe("회원 탈퇴 처리", () => {
    it("유효한 폼 데이터로 탈퇴 요청이 성공한다", async () => {
      const validFormData = {
        ...mockFormData,
        confirmword: "탈퇴하기",
        currentPassword: "validpassword123",
      };
      
      mockUseValidatedForm.mockReturnValue(validFormData);
      mockWithdrawRequest.mockResolvedValue({});

      // withdrawalSchema.parseAsync를 모킹
      const mockParseAsync = jest.spyOn(withdrawalSchema, 'parseAsync').mockResolvedValue({
        confirmword: "탈퇴하기",
        currentPassword: "validpassword123",
      });

      const { result } = renderHook(() => useWithdrawAuth());

      await act(async () => {
        await result.current.onWithdraw();
      });

      expect(mockParseAsync).toHaveBeenCalledWith({
        confirmword: "탈퇴하기",
        currentPassword: "validpassword123",
      });
      expect(mockWithdrawRequest).toHaveBeenCalledWith({
        password: "validpassword123",
      });
    });

    it("스키마 검증 실패 시 confirmword 필드에 포커스한다", async () => {
      const invalidFormData = {
        ...mockFormData,
        confirmword: "잘못된입력",
        currentPassword: "validpassword123",
        confirmwordRef: mockTextInputRef,
      };
      
      mockUseValidatedForm.mockReturnValue(invalidFormData);

      const { result } = renderHook(() => useWithdrawAuth());

      await act(async () => {
        await result.current.onWithdraw();
      });

      expect(mockTextInputRef.current.focus).toHaveBeenCalled();
      expect(mockWithdrawRequest).not.toHaveBeenCalled();
    });

    it("스키마 검증 실패 시 currentPassword 필드에 포커스한다", async () => {
      const invalidFormData = {
        ...mockFormData,
        confirmword: "탈퇴하기",
        currentPassword: "short",
        currentPasswordRef: mockTextInputRef,
      };
      
      mockUseValidatedForm.mockReturnValue(invalidFormData);



      const { result } = renderHook(() => useWithdrawAuth());

      await act(async () => {
        await result.current.onWithdraw();
      });

      expect(mockTextInputRef.current.focus).toHaveBeenCalled();
      expect(mockWithdrawRequest).not.toHaveBeenCalled();
    });

    it("API 요청 실패 시 에러를 처리한다", async () => {
      const validFormData = {
        ...mockFormData,
        confirmword: "탈퇴하기",
        currentPassword: "validpassword123",
      };
      
      mockUseValidatedForm.mockReturnValue(validFormData);
      mockWithdrawRequest.mockRejectedValue(new Error("API Error"));

      const mockParseAsync = jest.spyOn(withdrawalSchema, 'parseAsync').mockResolvedValue({
        confirmword: "탈퇴하기",
        currentPassword: "validpassword123",
      });

      const { result } = renderHook(() => useWithdrawAuth());

      // 에러가 발생해도 함수가 정상 완료되어야 함
      await act(async () => {
        await result.current.onWithdraw();
      });

      expect(mockParseAsync).toHaveBeenCalled();
      expect(mockWithdrawRequest).toHaveBeenCalled();
    });
  });

  describe("반환값 검증", () => {
    it("올바른 프로퍼티들을 반환한다", () => {
      const { result } = renderHook(() => useWithdrawAuth());

      const expectedProperties = [
        'currentPassword',
        'confirmword',
        'setCurrentPassword',
        'setConfirmword',
        'currentPasswordRef',
        'confirmwordRef',
        'validateConfirmword',
        'validateCurrentPassword',
        'currentPasswordValidation',
        'confirmwordValidation',
        'onCurrentPasswordBlur',
        'onConfirmwordBlur',
        'onWithdraw',
        'isCanWithdraw',
      ];

      expectedProperties.forEach(property => {
        expect(result.current).toHaveProperty(property);
      });
    });
  });

  describe("복잡한 시나리오", () => {
    it("사용자가 올바른 탈퇴 플로우를 완료한다", async () => {
      // 1. 초기 상태
      let currentFormData = { ...mockFormData };
      mockUseValidatedForm.mockReturnValue(currentFormData);

             const { result, rerender } = renderHook(() => useWithdrawAuth());

       expect(result.current.isCanWithdraw).toBe(false);

       // 2. 사용자가 확인 문자 입력 후 검증
       currentFormData = {
         ...mockFormData,
         confirmword: "탈퇴하기",
         confirmwordValidation: { state: "VALID" as const },
       } as any;
       mockUseValidatedForm.mockReturnValue(currentFormData);
       rerender({});

       // 3. 사용자가 비밀번호 입력 후 검증
       currentFormData = {
         ...mockFormData,
         confirmword: "탈퇴하기",
         currentPassword: "mypassword123",
         confirmwordValidation: { state: "VALID" as const },
         currentPasswordValidation: { state: "VALID" as const },
       } as any;
       mockUseValidatedForm.mockReturnValue(currentFormData);
       rerender({});

      expect(result.current.isCanWithdraw).toBe(true);

      // 4. 탈퇴 요청 성공
      mockWithdrawRequest.mockResolvedValue({});

      await act(async () => {
        await result.current.onWithdraw();
      });

      expect(mockWithdrawRequest).toHaveBeenCalledWith({
        password: "mypassword123",
      });
    });
  });
}); 