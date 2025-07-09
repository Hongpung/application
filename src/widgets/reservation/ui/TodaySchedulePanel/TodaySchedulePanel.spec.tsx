import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TodaySchedulePanel } from "./TodaySchedulePanel";

// React Native 컴포넌트 모킹
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  return {
    ...RN,
    View: "View",
    Text: "Text",
    ScrollView: "ScrollView",
    TouchableOpacity: "TouchableOpacity",
  };
});

// Jotai 모킹
jest.mock("jotai", () => ({
  useAtom: () => [[], jest.fn()],
  useAtomValue: jest.fn(() => []),
  useSetAtom: () => jest.fn(),
  createStore: () => ({}),
}));

// Color 상수 모킹
jest.mock("@hongpung/src/common", () => ({
  Color: {
    blue500: "#007AFF",
    grey300: "#D1D1D6",
    grey500: "#8E8E93",
    grey800: "#1C1C1E",
  },
}));

// ReservationCard 모킹
jest.mock("@hongpung/src/entities/reservation", () => {
  const mockReact = require("react");
  return {
    myTodayReservationState: {},
    ReservationCard: ({ onPress, reservation }: any) => (
      mockReact.createElement("TouchableOpacity", {
        testID: `reservation-card-${reservation.reservationId}`,
        onPress: () => onPress(),
      }, 
      mockReact.createElement("Text", {}, `예약 ${reservation.reservationId}`)
      )
    ),
  };
});

describe("TodaySchedulePanel Test", () => {
  const mockNavigateToReservationDetail = jest.fn();
  const mockNavigateToReservationCalendar = jest.fn();

  const defaultProps = {
    navigateToReservationDetail: mockNavigateToReservationDetail,
    navigateToReservationCalendar: mockNavigateToReservationCalendar,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("컴포넌트가 정상적으로 렌더링된다", () => {
    const { useAtomValue } = require("jotai");
    useAtomValue.mockReturnValue([]);

    render(<TodaySchedulePanel {...defaultProps} />);
    
    expect(TodaySchedulePanel).toBeDefined();
  });

  it("오늘 일정이 없을 때 빈 상태를 보여준다", () => {
    const { useAtomValue } = require("jotai");
    useAtomValue.mockReturnValue([]);

    const { getByText } = render(<TodaySchedulePanel {...defaultProps} />);
    
    expect(getByText("오늘의 일정이 없어요")).toBeTruthy();
    expect(getByText("새로운 일정 예약하러 가기")).toBeTruthy();
  });

  it("빈 상태에서 클릭 시 예약 캘린더로 이동한다", () => {
    const { useAtomValue } = require("jotai");
    useAtomValue.mockReturnValue([]);

    const { getByText } = render(<TodaySchedulePanel {...defaultProps} />);
    
    fireEvent.press(getByText("오늘의 일정이 없어요"));
    
    expect(mockNavigateToReservationCalendar).toHaveBeenCalledTimes(1);
  });

  it("예약 데이터가 있을 때 예약 목록을 보여준다", () => {
    const mockReservations = [
      {
        reservationId: 1,
        title: "피아노 연습",
        startTime: "14:00",
        endTime: "16:00",
        status: "confirmed",
      },
      {
        reservationId: 2,
        title: "기타 연습",
        startTime: "16:00",
        endTime: "18:00",
        status: "confirmed",
      },
    ];

    const { useAtomValue } = require("jotai");
    useAtomValue.mockReturnValue(mockReservations);

    const { getByTestId } = render(<TodaySchedulePanel {...defaultProps} />);
    
    expect(getByTestId("reservation-card-1")).toBeTruthy();
    expect(getByTestId("reservation-card-2")).toBeTruthy();
  });

  it("예약 카드 클릭 시 상세 페이지로 이동한다", () => {
    const mockReservations = [
      {
        reservationId: 1,
        title: "피아노 연습",
        startTime: "14:00",
        endTime: "16:00",
        status: "confirmed",
      },
    ];

    const { useAtomValue } = require("jotai");
    useAtomValue.mockReturnValue(mockReservations);

    const { getByTestId } = render(<TodaySchedulePanel {...defaultProps} />);
    
    fireEvent.press(getByTestId("reservation-card-1"));
    
    expect(mockNavigateToReservationDetail).toHaveBeenCalledTimes(1);
    expect(mockNavigateToReservationDetail).toHaveBeenCalledWith(1);
  });

  it("여러 예약이 있을 때 모든 예약이 렌더링된다", () => {
    const mockReservations = [
      { reservationId: 1, title: "연습실 A 예약" },
      { reservationId: 2, title: "연습실 B 예약" },
      { reservationId: 3, title: "연습실 C 예약" },
    ];

    const { useAtomValue } = require("jotai");
    useAtomValue.mockReturnValue(mockReservations);

    const { getByTestId } = render(<TodaySchedulePanel {...defaultProps} />);
    
    mockReservations.forEach((reservation) => {
      expect(getByTestId(`reservation-card-${reservation.reservationId}`)).toBeTruthy();
    });
  });

  it("컴포넌트가 존재한다", () => {
    expect(TodaySchedulePanel).toBeDefined();
    expect(typeof TodaySchedulePanel).toBe("function");
  });

  it("필수 props를 올바르게 받는다", () => {
    // 타입스크립트 체크를 위한 테스트
    const component = <TodaySchedulePanel {...defaultProps} />;
    expect(component).toBeTruthy();
  });
}); 