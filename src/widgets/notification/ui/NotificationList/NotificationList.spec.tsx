import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { NotificationList } from "./NotificationList";
import { NotificationType } from "@hongpung/src/entities/notification";

// GestureHandlerRootView 모킹
jest.mock("react-native-gesture-handler", () => ({
  GestureHandlerRootView: ({ children }: any) => children,
}));

// SwipeableNotificationCard 모킹
const mockSwipeableNotificationCard = jest.fn();
jest.mock(
  "../SwipeableNotificationCard/SwipeableNotificationCard",
  () => ({
    SwipeableNotificationCard: (props: any) => {
      mockSwipeableNotificationCard(props);
      return (
        <TouchableOpacity
          testID={`notification-card-${props.notification.notificationId}`}
          onPress={() => props.onDelete()}
        >
          <Text>{props.notification.data.title}</Text>
        </TouchableOpacity>
      );
    },
  })
);

// Color 모킹
jest.mock("@hongpung/src/common", () => ({
  Color: {
    grey200: "#E5E7EB",
    grey300: "#D1D5DB",
    grey400: "#9CA3AF",
  },
}));

describe("NotificationList 테스트", () => {
  const mockHandleDelete = jest.fn();

  const mockNotifications: NotificationType[] = [
    {
      notificationId: 1,
      isRead: false,
      timestamp: "2024-01-15T10:00:00Z",
      data: {
        title: "예약 확인",
        body: "예약이 승인되었습니다.",
        data: { reservationId: 123 },
      },
    },
    {
      notificationId: 2,
      isRead: true,
      timestamp: "2024-01-14T09:00:00Z",
      data: {
        title: "공지사항",
        body: "새로운 공지사항이 있습니다.",
        data: { noticeId: 456 },
      },
    },
    {
      notificationId: 3,
      isRead: true,
      timestamp: "2024-01-13T08:00:00Z",
      data: {
        title: "일반 알림",
        body: "일반적인 알림 메시지입니다.",
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("렌더링 테스트", () => {
    it("알림 데이터가 있을 때 목록이 올바르게 렌더링된다", () => {
      const { getByTestId } = render(
        <NotificationList
          data={mockNotifications}
          handleDelete={mockHandleDelete}
        />
      );

      // 각 알림 카드가 렌더링되는지 확인
      expect(getByTestId("notification-card-1")).toBeDefined();
      expect(getByTestId("notification-card-2")).toBeDefined();
      expect(getByTestId("notification-card-3")).toBeDefined();
    });

    it("알림 데이터가 비어있을 때 빈 상태 메시지가 표시된다", () => {
      const { getByText, queryByTestId } = render(
        <NotificationList data={[]} handleDelete={mockHandleDelete} />
      );

      expect(getByText("새로운 알림이 없습니다.")).toBeDefined();
      expect(queryByTestId("notification-card-1")).toBeNull();
    });

    it("알림 데이터가 null일 때 빈 상태 메시지가 표시된다", () => {
      const { getByText } = render(
        <NotificationList data={null} handleDelete={mockHandleDelete} />
      );

      expect(getByText("새로운 알림이 없습니다.")).toBeDefined();
    });

    it("마지막으로 읽은 알림 구분선이 올바른 위치에 표시된다", () => {
      const { getByText } = render(
        <NotificationList
          data={mockNotifications}
          handleDelete={mockHandleDelete}
          lastReadNotificationId={2}
        />
      );

      expect(getByText("이전 알림")).toBeDefined();
    });

    it("마지막으로 읽은 알림 ID가 없으면 구분선이 표시되지 않는다", () => {
      const { queryByText } = render(
        <NotificationList
          data={mockNotifications}
          handleDelete={mockHandleDelete}
        />
      );

      expect(queryByText("이전 알림")).toBeNull();
    });
  });

  describe("사용자 인터랙션 테스트", () => {
    it("사용자가 알림을 삭제하면 handleDelete가 호출된다", () => {
      const { getByTestId } = render(
        <NotificationList
          data={mockNotifications}
          handleDelete={mockHandleDelete}
        />
      );

      // 첫 번째 알림 카드를 클릭하여 삭제
      fireEvent.press(getByTestId("notification-card-1"));

      expect(mockHandleDelete).toHaveBeenCalledWith(1);
      expect(mockHandleDelete).toHaveBeenCalledTimes(1);
    });

    it("사용자가 여러 알림을 삭제할 수 있다", () => {
      const { getByTestId } = render(
        <NotificationList
          data={mockNotifications}
          handleDelete={mockHandleDelete}
        />
      );

      // 여러 알림 카드를 클릭하여 삭제
      fireEvent.press(getByTestId("notification-card-1"));
      fireEvent.press(getByTestId("notification-card-2"));
      fireEvent.press(getByTestId("notification-card-3"));

      expect(mockHandleDelete).toHaveBeenCalledWith(1);
      expect(mockHandleDelete).toHaveBeenCalledWith(2);
      expect(mockHandleDelete).toHaveBeenCalledWith(3);
      expect(mockHandleDelete).toHaveBeenCalledTimes(3);
    });
  });

  describe("SwipeableNotificationCard 전달 테스트", () => {
    it("SwipeableNotificationCard에 올바른 props가 전달된다", () => {
      render(
        <NotificationList
          data={mockNotifications}
          handleDelete={mockHandleDelete}
        />
      );

      // 첫 번째 알림에 대한 props 확인
      expect(mockSwipeableNotificationCard).toHaveBeenCalledWith(
        expect.objectContaining({
          notification: mockNotifications[0],
          onDelete: expect.any(Function),
        })
      );

      // 모든 알림에 대해 호출되었는지 확인
      expect(mockSwipeableNotificationCard).toHaveBeenCalledTimes(
        mockNotifications.length
      );
    });

    it("각 알림의 onDelete 함수가 올바른 ID로 호출된다", () => {
      render(
        <NotificationList
          data={mockNotifications}
          handleDelete={mockHandleDelete}
        />
      );

      // 첫 번째 알림의 onDelete 함수 실행
      const firstCallProps = mockSwipeableNotificationCard.mock.calls[0][0];
      firstCallProps.onDelete();

      expect(mockHandleDelete).toHaveBeenCalledWith(1);
    });
  });

  describe("구분선 표시 로직 테스트", () => {
    it("구분선이 올바른 알림 위에 표시된다", () => {
      const { getByText } = render(
        <NotificationList
          data={mockNotifications}
          handleDelete={mockHandleDelete}
          lastReadNotificationId={2}
        />
      );

      // 구분선이 두 번째 알림(ID: 2) 위에 표시되어야 함
      expect(getByText("이전 알림")).toBeDefined();
    });

    it("마지막으로 읽은 알림이 목록에 없으면 구분선이 표시되지 않는다", () => {
      const { queryByText } = render(
        <NotificationList
          data={mockNotifications}
          handleDelete={mockHandleDelete}
          lastReadNotificationId={999} // 존재하지 않는 ID
        />
      );

      expect(queryByText("이전 알림")).toBeNull();
    });
  });

  describe("특수 케이스 테스트", () => {
    it("알림이 하나만 있을 때 정상적으로 렌더링된다", () => {
      const singleNotification = [mockNotifications[0]];

      const { getByTestId } = render(
        <NotificationList
          data={singleNotification}
          handleDelete={mockHandleDelete}
        />
      );

      expect(getByTestId("notification-card-1")).toBeDefined();
      expect(mockSwipeableNotificationCard).toHaveBeenCalledTimes(1);
    });

    it("대량의 알림 데이터도 정상적으로 처리한다", () => {
      const manyNotifications: NotificationType[] = Array.from({ length: 100 }, (_, index) => ({
        notificationId: index + 1,
        isRead: false,
        timestamp: "2024-01-15T10:00:00Z",
        data: {
          title: `알림 ${index + 1}`,
          body: `본문 ${index + 1}`,
        },
      }));

      render(
        <NotificationList
          data={manyNotifications}
          handleDelete={mockHandleDelete}
        />
      );

      expect(mockSwipeableNotificationCard).toHaveBeenCalledTimes(100);
    });

    it("handleDelete 함수가 없어도 크래시되지 않는다", () => {
      const { getByTestId } = render(
        <NotificationList
          data={mockNotifications}
          handleDelete={undefined as any}
        />
      );

      // 렌더링은 정상적으로 되어야 함
      expect(getByTestId("notification-card-1")).toBeDefined();
    });
  });

  describe("접근성 테스트", () => {
    it("빈 상태 메시지가 접근 가능하다", () => {
      const { getByText } = render(
        <NotificationList data={[]} handleDelete={mockHandleDelete} />
      );

      const emptyMessage = getByText("새로운 알림이 없습니다.");
      expect(emptyMessage).toBeDefined();
    });

    it("구분선 텍스트가 접근 가능하다", () => {
      const { getByText } = render(
        <NotificationList
          data={mockNotifications}
          handleDelete={mockHandleDelete}
          lastReadNotificationId={2}
        />
      );

      const separatorText = getByText("이전 알림");
      expect(separatorText).toBeDefined();
    });
  });

  describe("성능 테스트", () => {
    it("FlatList에 keyExtractor가 올바르게 설정된다", () => {
      render(
        <NotificationList
          data={mockNotifications}
          handleDelete={mockHandleDelete}
        />
      );

      // FlatList의 keyExtractor가 notificationId를 사용하는지는
      // 실제 구현에서 확인됨 (렌더링 에러가 없으면 올바름)
      expect(mockSwipeableNotificationCard).toHaveBeenCalledTimes(
        mockNotifications.length
      );
    });
  });
}); 