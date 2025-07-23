import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NotificationIcon } from "./NotificationIcon";

// React Native 모킹
import { View, Text } from "react-native";

// Navigation 모킹
const mockUseIsFocused = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useIsFocused: mockUseIsFocused,
}));

// API 모킹
const mockUseGetNotReadNotificationFetch = jest.fn();
jest.mock(
  "@hongpung/src/features/notification/notReadNotification",
  () => ({
    useGetNotReadNotificationFetch: mockUseGetNotReadNotificationFetch,
  })
);

// Icons 모킹
jest.mock("@hongpung/src/common", () => ({
  ...jest.requireActual("@hongpung/src/common"),
  Icons: ({ name, size, color, testID }: any) => (
    <View testID={testID || `icon-${name}`} accessibilityLabel={`${name} icon`} />
  ),
  Color: {
    grey400: "#9CA3AF",
    red400: "#F87171",
  },
}));

describe("NotificationIcon 테스트", () => {
  const mockNavigateToNotificationPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsFocused.mockReturnValue(true);
    mockUseGetNotReadNotificationFetch.mockReturnValue({
      data: { status: false },
    });
  });

  describe("렌더링 테스트", () => {
    it("알림 아이콘이 올바르게 렌더링된다", () => {
      const { getByTestId } = render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      const icon = getByTestId("icon-notifications");
      expect(icon).toBeDefined();
      expect(icon.props.accessibilityLabel).toBe("notifications icon");
    });

    it("읽지 않은 알림이 없을 때 빨간 점이 표시되지 않는다", () => {
      mockUseGetNotReadNotificationFetch.mockReturnValue({
        data: { status: false },
      });

      const { queryByTestId } = render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      const notReadMarker = queryByTestId("not-read-marker");
      expect(notReadMarker).toBeNull();
    });

    it("읽지 않은 알림이 있을 때 빨간 점이 표시된다", () => {
      mockUseGetNotReadNotificationFetch.mockReturnValue({
        data: { status: true },
      });

      const { getByTestId } = render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      const notReadMarker = getByTestId("not-read-marker");
      expect(notReadMarker).toBeDefined();
    });

    it("API 데이터가 없을 때 빨간 점이 표시되지 않는다", () => {
      mockUseGetNotReadNotificationFetch.mockReturnValue({
        data: undefined,
      });

      const { queryByTestId } = render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      const notReadMarker = queryByTestId("not-read-marker");
      expect(notReadMarker).toBeNull();
    });
  });

  describe("사용자 인터랙션 테스트", () => {
    it("사용자가 알림 아이콘을 클릭하면 네비게이션 함수가 호출된다", () => {
      const { getByTestId } = render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      const pressable = getByTestId("notification-icon-pressable");
      fireEvent.press(pressable);

      expect(mockNavigateToNotificationPage).toHaveBeenCalledTimes(1);
    });

    it("사용자가 여러 번 클릭해도 모든 클릭이 처리된다", () => {
      const { getByTestId } = render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      const pressable = getByTestId("notification-icon-pressable");
      fireEvent.press(pressable);
      fireEvent.press(pressable);
      fireEvent.press(pressable);

      expect(mockNavigateToNotificationPage).toHaveBeenCalledTimes(3);
    });
  });

  describe("읽지 않은 알림 상태 테스트", () => {
    it("API에서 status가 true를 반환하면 읽지 않은 알림이 있음을 표시한다", () => {
      mockUseGetNotReadNotificationFetch.mockReturnValue({
        data: { status: true },
      });

      const { getByTestId } = render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      const notReadMarker = getByTestId("not-read-marker");
      expect(notReadMarker).toBeDefined();
      expect(notReadMarker.props.style).toEqual(
        expect.objectContaining({
          backgroundColor: "#F87171",
          borderRadius: 100,
          width: 12,
          height: 12,
        })
      );
    });

    it("API에서 status가 false를 반환하면 읽지 않은 알림이 없음을 표시한다", () => {
      mockUseGetNotReadNotificationFetch.mockReturnValue({
        data: { status: false },
      });

      const { queryByTestId } = render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      const notReadMarker = queryByTestId("not-read-marker");
      expect(notReadMarker).toBeNull();
    });

    it("API 호출이 실패하거나 데이터가 없을 때 안전하게 처리한다", () => {
      mockUseGetNotReadNotificationFetch.mockReturnValue({
        data: null,
      });

      const { queryByTestId } = render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      const notReadMarker = queryByTestId("not-read-marker");
      expect(notReadMarker).toBeNull();
    });
  });

  describe("API 호출 테스트", () => {
    it("컴포넌트가 마운트되면 읽지 않은 알림 API를 호출한다", () => {
      render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      expect(mockUseGetNotReadNotificationFetch).toHaveBeenCalledTimes(1);
    });

    it("화면이 포커스되면 API가 재호출된다", () => {
      mockUseIsFocused.mockReturnValue(true);

      render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      expect(mockUseGetNotReadNotificationFetch).toHaveBeenCalled();
      expect(mockUseIsFocused).toHaveBeenCalled();
    });
  });

  describe("복합 시나리오 테스트", () => {
    it("읽지 않은 알림이 있는 상태에서 사용자가 클릭하는 시나리오", () => {
      mockUseGetNotReadNotificationFetch.mockReturnValue({
        data: { status: true },
      });

      const { getByTestId } = render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      // 읽지 않은 알림 표시 확인
      const notReadMarker = getByTestId("not-read-marker");
      expect(notReadMarker).toBeDefined();

      // 아이콘 클릭
      const pressable = getByTestId("notification-icon-pressable");
      fireEvent.press(pressable);

      // 네비게이션 함수 호출 확인
      expect(mockNavigateToNotificationPage).toHaveBeenCalledTimes(1);
    });

    it("읽지 않은 알림이 없는 상태에서 사용자가 클릭하는 시나리오", () => {
      mockUseGetNotReadNotificationFetch.mockReturnValue({
        data: { status: false },
      });

      const { getByTestId, queryByTestId } = render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      // 읽지 않은 알림 표시가 없음을 확인
      const notReadMarker = queryByTestId("not-read-marker");
      expect(notReadMarker).toBeNull();

      // 아이콘 클릭
      const pressable = getByTestId("notification-icon-pressable");
      fireEvent.press(pressable);

      // 네비게이션 함수 호출 확인
      expect(mockNavigateToNotificationPage).toHaveBeenCalledTimes(1);
    });

    it("API 에러 상태에서도 사용자 인터랙션이 정상 동작한다", () => {
      mockUseGetNotReadNotificationFetch.mockReturnValue({
        data: undefined,
        error: "Network Error",
      });

      const { getByTestId } = render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      // 아이콘 클릭이 여전히 동작함
      const pressable = getByTestId("notification-icon-pressable");
      fireEvent.press(pressable);

      expect(mockNavigateToNotificationPage).toHaveBeenCalledTimes(1);
    });
  });

  describe("접근성 테스트", () => {
    it("아이콘이 접근 가능한 요소로 설정된다", () => {
      const { getByTestId } = render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      const pressable = getByTestId("notification-icon-pressable");
      expect(pressable.props.accessibilityRole).toBe("button");
      expect(pressable.props.accessibilityLabel).toBe("알림 페이지로 이동");
    });

    it("읽지 않은 알림이 있을 때 접근성 힌트가 제공된다", () => {
      mockUseGetNotReadNotificationFetch.mockReturnValue({
        data: { status: true },
      });

      const { getByTestId } = render(
        <NotificationIcon
          navigateToNotificationPage={mockNavigateToNotificationPage}
        />
      );

      const pressable = getByTestId("notification-icon-pressable");
      expect(pressable.props.accessibilityHint).toBe(
        "읽지 않은 알림이 있습니다."
      );
    });
  });
}); 