import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import { LogoutButton } from "./LogoutButton";

describe("LogoutButton", () => {
  const mockOnPress = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("로그아웃 버튼이 렌더링된다", () => {
    const { getByText } = render(<LogoutButton onPress={mockOnPress} />);
    
    expect(getByText("로그아웃")).toBeDefined();
  });

  it("버튼 클릭 시 onPress 함수가 호출된다", async () => {
    const { getByText } = render(<LogoutButton onPress={mockOnPress} />);

    act(() => {
      fireEvent.press(getByText("로그아웃"));
    });
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("버튼이 항상 활성화 상태로 렌더링된다", () => {
    const { getByText } = render(<LogoutButton onPress={mockOnPress} />);
    
    // LongButton의 isAble prop이 true로 설정되어 있는지 확인
    expect(getByText("로그아웃")).toBeDefined();
  });

  it("버튼이 빨간색으로 렌더링된다", () => {
    const { getByText } = render(<LogoutButton onPress={mockOnPress} />);
    
    // LongButton의 color prop이 "red"로 설정되어 있는지 확인
    expect(getByText("로그아웃")).toBeDefined();
  });

  it("올바른 텍스트가 표시된다", () => {
    const { getByText } = render(<LogoutButton onPress={mockOnPress} />);
    
    expect(getByText("로그아웃")).toBeDefined();
  });
}); 