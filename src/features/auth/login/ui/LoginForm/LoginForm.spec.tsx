import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";

import LoginForm from "./LoginForm";

import { TextInput } from "react-native";
import { ValidationState } from "@hongpung/src/common";

interface LoginFormProps {
  emailRef: React.RefObject<TextInput | null>;
  emailValidation: ValidationState;
  passwordValidation: ValidationState;
  email: string;
  password: string;

  onBlurValidateAllInput: () => void;

  setPassword: (password: string) => void;
  setEmail: (email: string) => void;

  onLogin: () => void;
  options: { saveID: boolean; autoLogin: boolean };
  passwordRef: React.RefObject<TextInput | null>;
  setAutoLogin: (value: boolean) => void;
  setSaveID: (value: boolean) => void;
  isLoading: boolean;
  LoginError: Error | null;
}


describe("LoginForm", () => {
  const baseProps: LoginFormProps = {
    emailRef: React.createRef<TextInput>(),
    passwordRef: React.createRef<TextInput>(),
    email: "",
    password: "",
    emailValidation: { state: "BEFORE" },
    passwordValidation: { state: "BEFORE" },
    setEmail: jest.fn(),
    setPassword: jest.fn(),
    onBlurValidateAllInput: jest.fn(),
    onLogin: jest.fn(),
    options: { saveID: false, autoLogin: false },
    setAutoLogin: jest.fn(),
    setSaveID: jest.fn(),
    isLoading: false,
    LoginError: null,
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("이메일, 비밀번호 입력 필드가 렌더링된다", () => {
    const { getByPlaceholderText } = render(<LoginForm {...baseProps} />);
    expect(getByPlaceholderText("이메일을 입력하세요")).toBeDefined();
    expect(getByPlaceholderText("비밀번호를 입력하세요")).toBeDefined();
  });

  it("로그인 버튼 클릭 시 onLogin 호출된다", async () => {
    const { getByText } = render(<LoginForm {...baseProps} />);

    act(() => {
      fireEvent.press(getByText("로그인"));
    });
    expect(baseProps.onLogin).toHaveBeenCalledTimes(1);
  });
});
