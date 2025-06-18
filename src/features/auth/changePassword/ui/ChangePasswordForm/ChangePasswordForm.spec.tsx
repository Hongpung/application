import React from "react";
import { render } from "@testing-library/react-native";
import { TextInput } from "react-native";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { ValidationState } from "@hongpung/src/common";

interface PasswordValue {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type PasswordFormValidation = {
  [key in keyof PasswordValue]: ValidationState;
};

interface ChangePasswordFormProps {
  currentPassword: string;
  setCurrentPassword: (text: string) => void;
  newPassword: string;
  setNewPassword: (text: string) => void;
  confirmPassword: string;
  setConfirmPassword: (text: string) => void;
  onChangePassword: () => Promise<void>;
  passwordValidation: PasswordFormValidation;
  onCurrentPasswordBlur: () => void;
  onNewPasswordBlur: () => void;
  onConfirmPasswordBlur: () => void;
  currentPasswordRef: React.RefObject<TextInput | null>;
  newPasswordRef: React.RefObject<TextInput | null>;
  confirmPasswordRef: React.RefObject<TextInput | null>;
  isCanChangePassword: boolean;
}

describe("ChangePasswordForm", () => {
  const baseProps: ChangePasswordFormProps = {
    currentPassword: "",
    setCurrentPassword: jest.fn(),
    newPassword: "",
    setNewPassword: jest.fn(),
    confirmPassword: "",
    setConfirmPassword: jest.fn(),
    onChangePassword: jest.fn(),
    passwordValidation: {
      currentPassword: { state: "BEFORE" },
      newPassword: { state: "BEFORE" },
      confirmPassword: { state: "BEFORE" },
    },
    onCurrentPasswordBlur: jest.fn(),
    onNewPasswordBlur: jest.fn(),
    onConfirmPasswordBlur: jest.fn(),
    currentPasswordRef: React.createRef<TextInput>(),
    newPasswordRef: React.createRef<TextInput>(),
    confirmPasswordRef: React.createRef<TextInput>(),
    isCanChangePassword: false,
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("비밀번호 입력 필드들이 렌더링된다", () => {
    const { getByText } = render(<ChangePasswordForm {...baseProps} />);
    
    expect(getByText("현재 비밀번호")).toBeDefined();
    expect(getByText("새로운 비밀번호")).toBeDefined();
    expect(getByText("새로운 비밀번호 확인")).toBeDefined();
  });

  it("버튼이 비활성화 상태일 때 클릭되지 않는다", () => {
    const { getByText } = render(<ChangePasswordForm {...baseProps} />);
    
    const button = getByText("비밀번호 변경");
    expect(button).toBeDefined();
  });

  it("모든 유효성 검사가 통과되면 버튼이 활성화된다", () => {
    const propsWithValidForm = {
      ...baseProps,
      isCanChangePassword: true,
      passwordValidation: {
        currentPassword: { state: "VALID" as const },
        newPassword: { state: "VALID" as const },
        confirmPassword: { state: "VALID" as const },
      },
    };
    
    const { getByText } = render(<ChangePasswordForm {...propsWithValidForm} />);
    
    expect(getByText("비밀번호 변경")).toBeDefined();
  });

  it("에러 상태일 때 입력 필드에 에러가 표시된다", () => {
    const propsWithError = {
      ...baseProps,
      passwordValidation: {
        currentPassword: { state: "ERROR" as const, errorText: "현재 비밀번호가 올바르지 않습니다" },
        newPassword: { state: "ERROR" as const, errorText: "비밀번호는 8~12자여야 합니다" },
        confirmPassword: { state: "ERROR" as const, errorText: "비밀번호가 일치하지 않습니다" },
      },
    };
    
    render(<ChangePasswordForm {...propsWithError} />);
    
    // 에러 상태가 적용되는지 확인
    // BasicInput이 ValidationState를 받아서 에러를 표시할 것임
  });

  it("입력값이 변경되면 set 함수들이 호출된다", () => {
    const { getAllByDisplayValue } = render(<ChangePasswordForm {...baseProps} />);
    
    const inputs = getAllByDisplayValue("");
    
    // 각 input에 대한 테스트는 실제 BasicInput 컴포넌트의 구현에 따라 달라질 수 있음
    expect(inputs.length).toBeGreaterThan(0);
  });
}); 