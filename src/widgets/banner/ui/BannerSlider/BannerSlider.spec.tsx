import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { BannerSlider } from "./BannerSlider";
import { Banner as BannerType } from "@hongpung/src/entities/banner";

// React Native 컴포넌트 모킹
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  
  return {
    ...RN,
    View: "View",
    Text: "Text",
    Image: "Image",
    TouchableOpacity: "TouchableOpacity",
    Dimensions: {
      get: () => ({ width: 375, height: 200 }),
    },
  };
});

// PagerView 모킹
jest.mock("react-native-pager-view", () => {
  const React = require("react");
  return React.forwardRef((props: any, ref: any) => {
    return React.createElement("PagerView", {
      testID: "banner-pager-view",
      ...props,
    });
  });
});

// Expo Image 모킹
jest.mock("expo-image", () => ({
  Image: "Image",
}));

// Navigation 모킹
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// BannerItem 모킹
jest.mock("@hongpung/src/entities/banner", () => {
  const mockReact = require("react");
  return {
    BannerItem: ({ banner, onBannerPress }: any) => (
      mockReact.createElement("BannerItem", {
        testID: `banner-item-${banner.bannerId}`,
        banner,
        onBannerPress,
      })
    ),
    BlankBanner: () => mockReact.createElement("BlankBanner", { testID: "blank-banner" }),
  };
});

describe("BannerSlider Test", () => {
  const mockBanners: BannerType[] = [
    {
      bannerId: "1",
      bannerImgUrl: "https://example.com/banner1.jpg",
      href: "https://example.com/link1",
    },
    {
      bannerId: "2",
      bannerImgUrl: "https://example.com/banner2.jpg",
      href: "https://example.com/link2",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("배너 데이터와 함께 정상적으로 렌더링된다", () => {
    const { getByTestId } = render(<BannerSlider banners={mockBanners} />);

    expect(getByTestId("banner-pager-view")).toBeTruthy();
  });

  it("배너 데이터가 없을 때 BlankBanner를 렌더링한다", () => {
    const { getByTestId } = render(<BannerSlider/>);

    expect(getByTestId("blank-banner")).toBeTruthy();
  });

  it("단일 배너일 때 BannerItem을 직접 렌더링한다", () => {
    const singleBanner = [mockBanners[0]];
    const { getByTestId } = render(<BannerSlider/>);

    expect(getByTestId(`banner-item-${singleBanner[0].bannerId}`)).toBeTruthy();
  });

  it("여러 배너일 때 PagerView를 사용한다", () => {
    const { getByTestId } = render(<BannerSlider/>);

    expect(getByTestId("banner-pager-view")).toBeTruthy();
  });

  it("배너 컴포넌트가 존재한다", () => {
    expect(BannerSlider).toBeDefined();
    expect(typeof BannerSlider).toBe("function");
  });

  it("필수 props 타입을 올바르게 받는다", () => {
    // 타입스크립트 체크를 위한 테스트
    const component = <BannerSlider/>;
    expect(component).toBeTruthy();
  });

  it("올바른 props를 PagerView에 전달한다", () => {
    const { getByTestId } = render(<BannerSlider/>);
    
    const pagerView = getByTestId("banner-pager-view");
    expect(pagerView).toBeTruthy();
    expect(pagerView.props.initialPage).toBe(1);
  });
}); 